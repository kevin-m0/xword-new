function HomeIconSidebar({
  active,
  ...props
}: React.ComponentProps<"svg"> & { active: boolean }) {
  return (
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.9912 5.44315V8.30531C22.0006 9.08351 21.7068 9.83365 21.1743 10.3907C20.6419 10.9477 19.9145 11.266 19.1522 11.2755H17.9884C17.5941 11.2324 17.2951 10.8927 17.2951 10.4879C17.2951 10.0831 17.5941 9.74347 17.9884 9.70038H19.1169C19.4739 9.69801 19.8152 9.55035 20.0651 9.29015C20.3151 9.02994 20.453 8.67869 20.4483 8.31431V5.44315C20.4388 4.69661 19.8482 4.09378 19.1169 4.08408H16.3044C15.5691 4.08408 14.9731 4.69256 14.9731 5.44315V9.73638C14.9587 10.1717 14.6062 10.5156 14.1796 10.5104C13.9746 10.5057 13.7799 10.4174 13.6391 10.2652C13.4983 10.113 13.423 9.9096 13.4302 9.70038V5.44315C13.4278 4.66341 13.7296 3.91478 14.2689 3.36257C14.8082 2.81036 15.5406 2.5 16.3044 2.5H19.1169C20.692 2.53818 21.9586 3.83515 21.9912 5.44315ZM8.69559 2.5H5.88306C4.2948 2.50983 3.00963 3.82178 3 5.44315V8.31431C3.00967 9.9342 4.29622 11.2436 5.88306 11.2485H8.69559C9.45942 11.2509 10.1928 10.9428 10.7337 10.3923C11.2746 9.84173 11.5787 9.09405 11.5787 8.31431V5.44315C11.5738 3.81975 10.2859 2.50494 8.69559 2.5ZM10.0269 8.31431C10.0316 8.67869 9.89372 9.02994 9.64379 9.29015C9.39386 9.55035 9.05256 9.69801 8.69559 9.70038H5.88306C5.52078 9.7078 5.17118 9.56416 4.91496 9.30259C4.65873 9.04102 4.51802 8.68414 4.52529 8.31431V5.44315C4.52522 5.07798 4.66911 4.72814 4.92453 4.47247C5.17995 4.21681 5.52541 4.07683 5.88306 4.08408H8.69559C9.42886 4.08899 10.0221 4.6946 10.0269 5.44315V8.31431ZM16.3044 12.7515H19.1169C20.7038 12.7564 21.9903 14.0658 22 15.6857V18.5568C21.9904 20.1782 20.7052 21.4902 19.1169 21.5H16.3044C14.7176 21.4901 13.435 20.1768 13.4302 18.5568V15.6857C13.4302 14.0652 14.717 12.7515 16.3044 12.7515ZM20.0609 19.5205C20.3111 19.2651 20.4506 18.918 20.4483 18.5568V15.6857C20.4483 15.3252 20.308 14.9796 20.0583 14.7247C19.8087 14.4698 19.47 14.3266 19.1169 14.3266H16.3044C15.5691 14.3266 14.9731 14.9351 14.9731 15.6857V18.5568C14.9707 18.918 15.1102 19.2651 15.3604 19.5205C15.6106 19.7759 15.9506 19.9183 16.3044 19.9159H19.1169C19.4707 19.9183 19.8107 19.7759 20.0609 19.5205ZM3 18.5479V15.6857C3 14.906 3.30403 14.1583 3.84496 13.6078C4.3859 13.0572 5.11924 12.7492 5.88306 12.7516H7.03805C7.33336 12.7193 7.62081 12.8619 7.77835 13.1189C7.9359 13.376 7.9359 13.7022 7.77835 13.9592C7.62081 14.2163 7.33336 14.3589 7.03805 14.3266H5.88306C5.14635 14.3266 4.54777 14.9337 4.54292 15.6857V18.5209C4.56166 19.2669 5.15217 19.8657 5.88306 19.8799H8.71322C9.06784 19.8823 9.40874 19.7402 9.66032 19.4851C9.9119 19.2299 10.0534 18.8829 10.0534 18.5209V14.2636C9.99586 13.9457 10.1334 13.624 10.4009 13.4509C10.6683 13.2778 11.012 13.288 11.2692 13.4767C11.5263 13.6654 11.6453 13.9947 11.5698 14.3086V18.5479C11.5698 20.1733 10.279 21.491 8.68677 21.491H5.88306C4.30456 21.4576 3.03275 20.1593 3 18.5479Z"
        fill={active ? "black" : "white"}
        fillOpacity="0.7"
      />
    </svg>
  );
}

export default HomeIconSidebar;
