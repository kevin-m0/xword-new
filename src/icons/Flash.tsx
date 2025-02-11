function FlashIcon({featuredIcon, ...props} :  React.ComponentProps<"svg"> & {featuredIcon?: boolean}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill="none"
      {...props}
    >
      <path 
      stroke = {featuredIcon ? "#000" : "#fff"}
      strokeWidth={1.5} d="M19 10h-7V4L5 14h7v6l7-10Z" />
    </svg>
  );
}

export default FlashIcon;
