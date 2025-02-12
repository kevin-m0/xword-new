import { X } from "lucide-react";
import { toast } from "sonner";

export const LoadingToast: React.FC = () => {
  toast.custom((t) => (
    <div className="absolute bottom-2 -left-16 w-[436px] toast-bg p-4 rounded-lg">
      <div className="flex items-center space-x-2">
        <svg
          width="27"
          height="26"
          viewBox="0 0 27 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            width="27"
            height="26"
            rx="6"
            fill="#EBD510"
            fillOpacity="0.96"
          />
          <path
            d="M13.368 9.144C12.888 9.144 12.4933 9.00533 12.184 8.728C11.8853 8.44 11.736 8.088 11.736 7.672C11.736 7.24533 11.8853 6.89333 12.184 6.616C12.4933 6.328 12.888 6.184 13.368 6.184C13.8373 6.184 14.2213 6.328 14.52 6.616C14.8293 6.89333 14.984 7.24533 14.984 7.672C14.984 8.088 14.8293 8.44 14.52 8.728C14.2213 9.00533 13.8373 9.144 13.368 9.144ZM14.728 10.072V19H11.992V10.072H14.728Z"
            fill="white"
          />
        </svg>
        <div>
          <p className="font-bold">Loading</p>
          <p>Your workspace will be ready in a while.</p>
        </div>
      </div>

      <button
        className="absolute top-2 right-2"
        onClick={() => toast.dismiss(t)}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  ));
  return null;
};

export const MessageToast = ({
  t,
  title,
  description,
}: {
  t: string | number;
  title?: string;
  description: string;
}) => {
  toast.custom((t) => (
    <div className="absolute bottom-2 -left-16 w-[436px] toast-bg p-4 rounded-lg">
      <div>
        {title && <p className="font-bold">{title}</p>}
        <p>{description}</p>
      </div>

      <button
        className="absolute top-2 right-2"
        onClick={() => toast.dismiss(t)}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  ));
  return null;
};

export const SuccessToast = ({
  t,
  title,
  description,
}: {
  t: string | number;
  title?: string;
  description: string;
}) => {
  return (
    <div className="absolute bottom-2 -left-16 w-[436px] toast-bg p-4 rounded-lg">
      <div className="flex items-center space-x-2">
        <svg
          width="36"
          height="31"
          viewBox="0 0 36 31"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="4"
            y="2"
            width="27"
            height="27"
            rx="6"
            fill="#29E452"
            fillOpacity="0.78"
          />
          <path
            d="M26 10L15 21L10 16"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div>
          {title && <p className="font-bold">{title}</p>}
          <p>{description}</p>
        </div>
      </div>

      <button
        className="absolute top-2 right-2"
        onClick={() => toast.dismiss(t)}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export const ErrorToast = ({
  t,
  title,
  description,
}: {
  t: string | number;
  title?: string;
  description: string;
}) => {
  return (
    <div className="absolute bottom-2 -left-16 w-[436px] toast-bg p-4 rounded-lg">
      <div className="flex items-center space-x-2">
        <svg
          width="27"
          height="27"
          viewBox="0 0 27 27"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            width="27"
            height="27"
            rx="6"
            fill="#E43F29"
            fillOpacity="0.87"
          />
          <path
            d="M12.527 5.86155L5.23087 18.5153C5.08044 18.786 5.00085 19.0928 5.00001 19.4053C4.99916 19.7178 5.0771 20.0251 5.22607 20.2966C5.37504 20.5681 5.58984 20.7944 5.84911 20.9529C6.10838 21.1114 6.40308 21.1966 6.70388 21.2H21.2961C21.5969 21.1966 21.8916 21.1114 22.1509 20.9529C22.4102 20.7944 22.625 20.5681 22.7739 20.2966C22.9229 20.0251 23.0008 19.7178 23 19.4053C22.9992 19.0928 22.9196 18.786 22.7691 18.5153L15.473 5.86155C15.3194 5.59855 15.1032 5.3811 14.8452 5.23019C14.5872 5.07928 14.2961 5 14 5C13.7039 5 13.4128 5.07928 13.1548 5.23019C12.8968 5.3811 12.6806 5.59855 12.527 5.86155Z"
            stroke="white"
            strokeWidth="1.467"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 10.3984L14 14.8984"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 17.6016H14.072"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div>
          {title && <p className="font-bold">{title}</p>}
          <p>{description}</p>
        </div>
      </div>

      <button
        className="absolute top-2 right-2"
        onClick={() => toast.dismiss(t)}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
