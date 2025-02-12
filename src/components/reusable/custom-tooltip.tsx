import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

interface CustomToolTipProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  delay?: number;
  text: string;
}

export const CustomTooltip: React.FC<CustomToolTipProps> = ({
  children,
  text,
  delay,
  ...props
}) => {
  return (
    <TooltipProvider delayDuration={delay}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent style={{ zIndex: 9999 }}>
          <p className="text-xs" {...props}>
            {text}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
