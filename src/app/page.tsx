import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { HydrateClient } from "~/trpc/server";
import { getUser } from "~/utils/clerk-utility";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <Link href={"/sign-in"}>
          <Button>Log in to xWord</Button>
        </Link>
      </main>
    </HydrateClient>
  );
}
