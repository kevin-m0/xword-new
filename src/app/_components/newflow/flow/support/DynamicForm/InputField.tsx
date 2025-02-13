import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";

interface InputFieldProps {
  type: string;
  inputType: string;
  formData: Record<string, string>;
  isInputDataComplete: boolean;
  onInputChange: (field: string, value: string) => void;
}

export const InputField = ({
  type,
  inputType,
  formData,
  isInputDataComplete,
  onInputChange,
}: InputFieldProps) => {
  const placeholder = type
    .toLowerCase()
    .replace("what is", "Enter")
    .replace("?", "");
  if (inputType === "text") {
    return (
      <Textarea
        placeholder={placeholder}
        className={cn(isInputDataComplete && "opacity-70")}
        onChange={(e) => onInputChange(type, e.target.value)}
        value={formData[type] || ""}
        disabled={isInputDataComplete}
        minLength={12}
        maxLength={4000}
      />
    );
  }

  if (inputType === "URL") {
    return (
      <div className="space-y-4">
        <Input
          type="url"
          placeholder="Enter the URL of your brand's homepage ('apple.com')"
          onChange={(e) => onInputChange(type, e.target.value)}
          value={formData[type] || ""}
          disabled={isInputDataComplete}
          pattern="https?://.+"
        />
        <div className="space-y-3">
          <p className="text-base text-gray-400">Good examples to test with:</p>
          <div className="space-y-2">
            {[
              "www.patagonia.com",
              "www.harley-davidson.com",
              "www.mailchimp.com",
            ].map((url) => (
              <a
                key={url}
                href={`https://${url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-base text-indigo-400 transition-colors hover:text-indigo-300"
              >
                {url}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Input
      type="text"
      placeholder={placeholder}
      className={cn("w-full")}
      onChange={(e) => onInputChange(type, e.target.value)}
      value={formData[type] || ""}
      disabled={isInputDataComplete}
      minLength={6}
    />
  );
};
