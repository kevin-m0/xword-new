function Pause(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={22}
      fill="none"
      {...props}
    >
      <path
        fill="#fff"
        d="M2.427 22h3.107c1.256 0 1.904-.648 1.904-1.904V1.904C7.438.62 6.79.014 5.534 0H2.427C1.171 0 .524.648.524 1.904v18.192C.51 21.352 1.158 22 2.427 22Zm10.049 0h3.093c1.256 0 1.904-.648 1.904-1.904V1.904C17.473.62 16.825 0 15.57 0h-3.093c-1.27 0-1.904.648-1.904 1.904v18.192c0 1.256.634 1.904 1.904 1.904Z"
      />
    </svg>
  );
}

export default Pause;
