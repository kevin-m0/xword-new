interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  minLength?: number;
  placeholder?: string;
  error?: string;
}

export function TextInput({
  value,
  onChange,
  minLength = 50,
  placeholder,
  error,
}: TextInputProps) {
  const isValid = value.length >= minLength;

  return (
    <div className="w-full space-y-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-32 p-3 border rounded-lg text-black resize-none focus:ring-2 focus:outline-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      <div className="flex justify-between text-sm">
        <span className={error ? "text-red-500" : "text-gray-500"}>
          {error || `${value.length}/${minLength}`}
        </span>
        {!isValid && !error && (
          <span className="text-amber-600">
            Please enter at least {minLength} characters
          </span>
        )}
      </div>
    </div>
  );
}
