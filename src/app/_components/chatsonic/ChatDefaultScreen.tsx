import { Card, CardContent } from "~/components/ui/card";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { CgPacman } from "react-icons/cg";
import { Sparkles } from "lucide-react";

export default function ChatDefaultScreen() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 px-4 pt-32 lg:flex-nowrap">
      <Card className="h-full w-full rounded-3xl lg:w-[700px]">
        <CardContent className="p-6">
          <div className="flex h-full flex-col">
            <div className="relative h-[300px] w-full overflow-hidden rounded-xl">
              <Image
                src="/images/chatsonic/home page/creator.webp"
                alt="Chat app interface"
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-6">
              <h2 className="text-2xl font-bold text-primary">
                Your Personal Content Creator
              </h2>
              <p className="mt-2 text-muted-foreground">
                Generate unique and engaging content effortlessly. Whether it's
                writing or brainstorming ideas, our AI-powered tool helps bring
                your creativity to life.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex w-full flex-col gap-4 lg:w-auto">
        {/* Middle top card - Feature highlight */}
        <Card className="h-[260px] w-full rounded-3xl lg:w-[400px]">
          <CardContent className="h-full p-6">
            <div className="flex h-full">
              <div className="flex-1">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-primary">
                  Character Chat
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Engage in dynamic conversations with AI-driven characters.
                  Customize personalities, explore unique dialogues, and bring
                  your favorite characters to life.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    "Prompt Expert",
                    "Data Analyst",
                    "Creative Visionary",
                    "+47 more",
                  ].map((lang, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Middle bottom card - Security feature */}
        <Card className="h-[260px] w-full rounded-3xl lg:w-[400px]">
          <CardContent className="h-full p-6">
            <div className="flex h-full flex-col">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary">
                End-to-End Encryption
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your conversations stay private with military-grade encryption.
                Only you and your recipients can read your messages.
              </p>
              <div className="mt-4 flex items-center">
                <div className="relative h-16 w-full">
                  <Image
                    src="/images/chatsonic/home page/encrypt.webp"
                    alt="Encryption visualization"
                    fill
                    className="rounded-xl object-cover"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="h-full w-full rounded-3xl lg:w-[700px]">
        <CardContent className="p-6">
          <div className="flex h-full flex-col">
            <div className="relative h-[300px] w-full overflow-hidden rounded-xl">
              <Image
                src="/images/chatsonic/home page/neatly.webp"
                alt="Chat app on mobile devices"
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-6">
              <h2 className="text-2xl font-bold text-primary">
                The Web, Neatly Arranged!
              </h2>
              <p className="mt-2 text-muted-foreground">
                Search the web with ease and chat with PDFs effortlessly. Making
                research and exploration smoother than ever.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
