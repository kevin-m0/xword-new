import XWCheckbox from "~/components/reusable/xw-checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/reusable/XWSelect";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";

interface FormField {
  type: string;
  options?: string[];
  label: string;
}

interface ParameterFieldProps {
  field: FormField;
  formData: Record<string, string>;
  selectedOptions: Record<string, string[]>;
  customOptions: Record<string, string[]>;
  showNewOptionInput: Record<string, boolean>;
  newOption: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
  onMultiSelect: (field: string, value: string) => void;
  onShowNewOptionInput: (field: string, show: boolean) => void;
  onNewOptionChange: (field: string, value: string) => void;
  onAddNewOption: (field: string) => void;
}

export const ParameterField = ({
  field,
  formData,
  selectedOptions,
  customOptions,
  showNewOptionInput,
  newOption,
  onInputChange,
  onMultiSelect,
  onShowNewOptionInput,
  onNewOptionChange,
  onAddNewOption,
}: ParameterFieldProps) => {
  // Handle text input
  if (field.type === "text") {
    return (
      <Input
        type="text"
        value={formData[field.label] || ""}
        onChange={(e) => onInputChange(field.label, e.target.value)}
        placeholder={`Enter ${field.label.toLowerCase()}`}
      />
    );
  }

  // Handle textarea input
  if (field.type === "textarea") {
    return (
      <Textarea
        value={formData[field.label] || ""}
        onChange={(e) => onInputChange(field.label, e.target.value)}
        placeholder={`Enter ${field.label.toLowerCase()}`}
      />
    );
  }

  if (field.type === "boolean") {
    return (
      <div className="flex items-center space-x-3">
        <Switch
          id={`${field.label}-switch`}
          checked={formData[field.label] === "true"}
          onCheckedChange={(checked) =>
            onInputChange(field.label, checked.toString())
          }
          className="data-[state=checked]:bg-indigo-500"
        />
        <Label
          htmlFor={`${field.label}-switch`}
          className="text-lg text-gray-300"
        >
          {formData[field.label] === "true" ? "Yes" : "No"}
        </Label>
      </div>
    );
  }

  if (field.type === "single" && field.options) {
    return (
      <div className="space-y-3">
        <Select
          onValueChange={(value: any) => onInputChange(field.label, value)}
          value={formData[field.label]}
        >
          <SelectTrigger>
            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            <div className="p-2">
              {[
                ...(field.options || []),
                ...(customOptions[field.label] || []),
              ].map((option, optIndex) => (
                <SelectItem key={optIndex} value={option}>
                  {option}
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>
      </div>
    );
  }
  if (field.type === "multiple" && field.options) {
    return (
      <div className="space-y-4">
        <Select>
          <SelectTrigger>
            <div className="truncate">
              {(selectedOptions?.[field.label]?.length as number) > 0
                ? selectedOptions[field.label]?.join(", ")
                : "Select options"}
            </div>
          </SelectTrigger>
          <SelectContent>
            <div className="space-y-2 p-3">
              {[
                ...(field.options || []),
                ...(customOptions[field.label] || []),
              ].map((option, optIndex) => {
                const isSelected = (
                  selectedOptions[field.label] || []
                ).includes(option);
                return (
                  <div key={optIndex} className="flex items-center space-x-3">
                    <XWCheckbox
                      id={`${field.label}-${optIndex}`}
                      checked={isSelected}
                      onCheckedChange={() => onMultiSelect(field.label, option)}
                      className="h-5 w-5 rounded-lg border-2 border-gray-700/50 bg-gray-900/50 text-indigo-500 focus:ring-indigo-500"
                    />
                    <label htmlFor={`${field.label}-${optIndex}`}>
                      {option}
                    </label>
                  </div>
                );
              })}
            </div>
          </SelectContent>
        </Select>
      </div>
    );
  }
  return null;
};
