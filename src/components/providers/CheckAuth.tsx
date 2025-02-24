import { getUser } from "~/utils/clerk-utility";
import { redirect } from "next/navigation";

export const CheckAuth = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = await getUser();
  if (!user) redirect("/sign-in");

  return <div className="">{children}</div>;
};
