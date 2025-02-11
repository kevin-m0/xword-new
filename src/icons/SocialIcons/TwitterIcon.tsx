import React from "react";

interface TwitterIconProps extends React.SVGProps<SVGSVGElement> {}

const TwitterIcon: React.FC<TwitterIconProps> = (props) => {
    return (
        <div className="bg-black rounded-md">
            <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                {...props}
            >
                <g id="mage:x">
                    <path
                        id="Vector"
                        d="M18.4785 3.72656H21.5455L14.8455 11.3516L22.7275 21.7266H16.5555L11.7225 15.4336L6.19154 21.7266H3.12154L10.2885 13.5716L2.72754 3.72656H9.05554L13.4255 9.47856L18.4785 3.72656ZM17.4025 19.8986H19.1025L8.13154 5.45856H6.30754L17.4025 19.8986Z"
                        fill="white"
                    />
                </g>
            </svg>

        </div>
    );
};

export default TwitterIcon;
