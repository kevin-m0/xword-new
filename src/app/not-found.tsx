import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function NotFound() {
  return (
    <>
      <h1 className="absolute inset-0 z-0 flex items-center justify-center text-[30rem] text-white text-opacity-20">
        404
      </h1>
      <div className="relative z-10 flex h-screen items-center justify-center bg-black bg-opacity-50">
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-3xl font-bold">Page not found</h2>
          <p>The page you are looking for does not exists.</p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-gradient-to-br from-transparent via-white to-white text-black bg-blend-overlay"
            >
              Go back
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
