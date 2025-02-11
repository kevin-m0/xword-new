const RATE_LIMIT_WINDOW = 1000; // 1 second
const MAX_CONCURRENT_REQUESTS = 2;

export class RateLimiter {
  private queue: Array<() => Promise<void>> = [];
  private running = 0;
  private lastRequestTime = 0;

  async schedule<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await this.executeWithDelay(fn);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  private async executeWithDelay<T>(fn: () => Promise<T>): Promise<T> {
    const now = Date.now();
    const timeToWait = Math.max(0, RATE_LIMIT_WINDOW - (now - this.lastRequestTime));
    
    if (timeToWait > 0) {
      await new Promise(resolve => setTimeout(resolve, timeToWait));
    }
    
    this.lastRequestTime = Date.now();
    return fn();
  }

  private async processQueue() {
    if (this.running >= MAX_CONCURRENT_REQUESTS || this.queue.length === 0) {
      return;
    }

    this.running++;
    const task = this.queue.shift();
    
    if (task) {
      try {
        await task();
      } finally {
        this.running--;
        this.processQueue();
      }
    }
  }
}