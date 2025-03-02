import { Card, CardContent } from "~/components/ui/card";

export default function ChatDefaultScreen() {
  return (
    <div className="minw-4xl flex items-center justify-center gap-4 pt-32">
      <Card className="h-full w-[700px] rounded-3xl">
        <CardContent></CardContent>
      </Card>
      <div className="flex flex-col gap-4">
        <Card className="h-[260px] w-[400px] rounded-3xl">
          <CardContent></CardContent>
        </Card>
        <Card className="h-[260px] w-[400px] rounded-3xl">
          <CardContent></CardContent>
        </Card>
      </div>
      <Card className="h-full w-[700px] rounded-3xl">
        <CardContent></CardContent>
      </Card>
    </div>
  );
}
