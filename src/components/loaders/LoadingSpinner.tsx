
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  text?: string;
}

export function LoadingSpinner({ text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
}