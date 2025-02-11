function Play(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={17}
      height={19}
      fill="none"
      {...props}
    >
      <path
        fill="#fff"
        d="M1.676 18.424c.422 0 .793-.15 1.255-.422l11.863-6.86c.864-.503 1.226-.894 1.226-1.527 0-.633-.362-1.015-1.226-1.527L2.931 1.228C2.47.956 2.098.806 1.676.806.852.806.27 1.438.27 2.433v14.364c0 1.004.582 1.627 1.406 1.627Z"
      />
    </svg>
  );
}

export default Play;
