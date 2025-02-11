function AccountSidebarIcon({
  active,
  ...props
}: React.ComponentProps<"svg"> & { active: boolean }) {
  return (
    <svg
      width="26"
      height="25"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.44182 6.87447C8.61856 7.33075 7.60873 7.3242 6.79176 6.85727L6.75578 6.82213C6.38818 6.59899 6.27542 6.12709 6.50393 5.76812C6.73244 5.40914 7.21569 5.29903 7.58329 5.52218C7.74738 5.61568 7.93305 5.66705 8.12297 5.6715C8.41407 5.68339 8.69806 5.58174 8.91235 5.38897C9.12663 5.19619 9.25361 4.92811 9.26529 4.64383C9.25976 3.21545 10.4207 2.04284 11.8827 2H13.115C14.6053 2 15.8134 3.17975 15.8134 4.63505C15.811 4.82028 15.8608 5.0026 15.9573 5.16206C16.1006 5.40892 16.339 5.5896 16.6194 5.66384C16.8999 5.73808 17.1991 5.69972 17.4504 5.55731C18.7167 4.88418 20.3011 5.30193 21.0483 6.50593C21.2548 6.87335 21.1278 7.33444 20.7605 7.55116C20.3872 7.75928 19.912 7.6384 19.6901 7.27888C19.3853 6.77187 18.719 6.59942 18.197 6.8924C17.371 7.33407 16.369 7.32329 15.5532 6.86395C14.7373 6.40461 14.2258 5.56317 14.2034 4.64383C14.2131 4.35592 14.1028 4.07648 13.8976 3.8695C13.6924 3.66252 13.41 3.54574 13.115 3.54589H11.8827C11.587 3.54581 11.3037 3.66232 11.0971 3.86901C10.8905 4.07571 10.7781 4.35509 10.7854 4.64383C10.7771 5.56818 10.2651 6.41819 9.44182 6.87447ZM10.7854 19.3913C10.7903 19.9797 11.2802 20.4541 11.8827 20.4541L11.8737 20.4717C12.1533 20.4717 12.4117 20.6173 12.5514 20.8538C12.6912 21.0902 12.6912 21.3815 12.5514 21.6179C12.4117 21.8544 12.1533 22 11.8737 22C10.3835 22 9.17535 20.8202 9.17535 19.365C9.17777 19.1797 9.12799 18.9974 9.03143 18.8379C8.72964 18.3278 8.06266 18.1512 7.53832 18.4427C6.27209 19.1158 4.68767 18.6981 3.94046 17.4941L3.32882 16.4488C2.6395 15.2123 3.0673 13.6651 4.30024 12.9354C4.46366 12.8416 4.59987 12.7085 4.69601 12.549C4.8764 12.3034 4.94123 11.9945 4.87428 11.6995C4.80733 11.4045 4.61494 11.1512 4.34522 11.0031C3.11227 10.2734 2.68448 8.72618 3.37379 7.48968C3.48913 7.32036 3.66883 7.20292 3.8731 7.16335C4.07736 7.12379 4.28936 7.16536 4.46215 7.27888C4.80347 7.50552 4.90243 7.95394 4.68701 8.29776C4.38931 8.80716 4.57045 9.45576 5.09177 9.74704C5.48345 9.98141 5.80585 10.3114 6.02722 10.7044C6.71653 11.9409 6.28874 13.4882 5.05579 14.2178C4.53447 14.5091 4.35333 15.1577 4.65103 15.6671L5.27167 16.7123C5.41288 16.9614 5.65203 17.1435 5.93385 17.2164C6.21567 17.2894 6.51576 17.2469 6.76478 17.0988C7.16629 16.8714 7.62284 16.7531 8.08699 16.7563C9.57728 16.7563 10.7854 17.936 10.7854 19.3913ZM20.6885 12.9267C20.4372 12.7853 20.2541 12.5518 20.1798 12.2781C20.1055 12.0043 20.1462 11.713 20.2927 11.4686C20.3889 11.309 20.5251 11.176 20.6885 11.0821C21.0576 10.8656 21.1782 10.3985 20.9584 10.0369C20.7398 9.67998 20.2734 9.55261 19.897 9.74704C18.664 10.4767 18.2362 12.0239 18.9256 13.2604C19.1445 13.6924 19.4845 14.0549 19.906 14.3057C20.1566 14.4453 20.3396 14.6772 20.414 14.9496C20.4883 15.2219 20.4479 15.5119 20.3017 15.7549L19.6901 16.8002C19.5428 17.0448 19.3043 17.2242 19.0245 17.3008C18.7442 17.3738 18.4456 17.3326 18.197 17.1866C17.3696 16.7443 16.3658 16.756 15.5494 17.2174C14.733 17.6789 14.2227 18.5231 14.2034 19.444C14.2464 19.8368 14.5859 20.1347 14.9904 20.1347C15.3949 20.1347 15.7344 19.8368 15.7774 19.444C15.77 19.0603 15.9768 18.7029 16.3172 18.5111C16.6577 18.3193 17.078 18.3234 17.4145 18.5217C18.6807 19.1949 20.2651 18.7771 21.0123 17.5731L21.624 16.5279C22.3792 15.2805 21.9613 13.6717 20.6885 12.9267ZM12.4944 8.70179C11.1257 8.70179 9.89191 9.5074 9.36897 10.7426C8.84604 11.9777 9.13704 13.3989 10.1061 14.3428C11.0753 15.2866 12.5314 15.567 13.7949 15.053C15.0583 14.5391 15.88 13.3322 15.8764 11.9956C15.8764 11.1205 15.5198 10.2814 14.8853 9.66341C14.2508 9.04545 13.3905 8.69946 12.4944 8.70179ZM12.4944 13.7611C11.5009 13.7611 10.6954 12.9746 10.6954 12.0044C10.6954 11.0342 11.5009 10.2477 12.4944 10.2477C13.4879 10.2477 14.2933 11.0342 14.2933 12.0044C14.2933 12.9746 13.4879 13.7611 12.4944 13.7611Z"
        fill={active ? "black" : "white"}
        fillOpacity="0.7"
      />
    </svg>
  );
}

export default AccountSidebarIcon;
