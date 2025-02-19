import { getUser } from "~/utils/clerk-utility";
import { redirect } from "next/navigation";

export const RootLayoutComp = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = await getUser();
  if (!user) redirect("/sign-in");

  return <div>{children}</div>;
};
