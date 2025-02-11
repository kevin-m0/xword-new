interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  shouldRetry?: (error: any) => boolean;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  delayMs: 1000,
  shouldRetry: (error: any) => {
    return error?.status === 429 || error?.status >= 500;
  },
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: any;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (!opts.shouldRetry(error) || attempt === opts.maxAttempts) {
        throw error;
      }

      await new Promise(resolve => 
        setTimeout(resolve, opts.delayMs * attempt)
      );
    }
  }

  throw lastError;
}