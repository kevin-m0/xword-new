function UploadFile(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={22}
      height={24}
      fill="none"
      {...props}
    >
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="M5.499 6h-2.75c-.504 0-.917.45-.917 1v14c0 .55.413 1 .917 1h12.833c.504 0 .917-.45.917-1v-3H6.415c-.504 0-.916-.45-.916-1V6Z"
      />
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="M19.25 18H6.417c-.505 0-.917-.45-.917-1V3c0-.55.412-1 .917-1h9.707c.248 0 .477.11.651.29l3.126 3.41c.165.19.266.45.266.71V17c0 .55-.413 1-.917 1ZM16.501 14H9.168M9.168 10h7.333M9.168 6h2.75"
      />
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="M15.582 2v5h4.583v-.59c0-.26-.1-.52-.265-.7l-3.135-3.42a.887.887 0 0 0-.642-.29h-.541Z"
      />
    </svg>
  );
}

export default UploadFile;
