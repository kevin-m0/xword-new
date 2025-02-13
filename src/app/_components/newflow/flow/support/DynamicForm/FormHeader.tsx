import XWBadge from "~/components/reusable/XWBadge";

interface FormHeaderProps {
  categoryName: string;
  subCategoryName: string;
  promptTitle: string;
  promptDescription: string;
}

export const FormHeader = ({
  categoryName,
  subCategoryName,
  promptTitle,
  promptDescription,
}: FormHeaderProps) => {
  return (
    <div className="space-y-4">
      <div>
        {promptTitle === promptDescription ? (
          <h2 className="text-3xl font-bold">{promptTitle}</h2>
        ) : (
          <>
            <h2 className="text-3xl font-bold">{promptTitle}</h2>
            <p className="text-xw-muted text-sm leading-relaxed">
              {promptDescription}
            </p>
          </>
        )}
      </div>
      <div className="flex gap-4">
        <XWBadge>{categoryName}</XWBadge>
        <XWBadge>{subCategoryName}</XWBadge>
      </div>
    </div>
  );
};
