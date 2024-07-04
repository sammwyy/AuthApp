import { Button } from "@/components/ui/button";
import { LockOpen1Icon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col w-full mt-20 items-center">
      <LockOpen1Icon className="w-16 h-16" />

      <h1 className="text-5xl my-4">Welcome to AuthApp!</h1>
      <p className="text-muted-foreground">
        A simple and secure way to manage your 2FA tokens.
      </p>

      <div className="flex flex-col w-[95%] max-w-[400px] mt-8 gap-2 border px-7 py-5 rounded-md">
        <Link href="/app">
          <Button className="btn-primary w-full">Go to App</Button>
        </Link>
      </div>
    </div>
  );
}
