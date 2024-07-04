import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LockOpen1Icon } from "@radix-ui/react-icons";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";

export default function LockPage() {
  const [pin, setPin] = useState<string>("");

  return (
    <div className="flex flex-col w-full mt-20 items-center">
      <LockOpen1Icon className="w-16 h-16" />

      <h1 className="text-5xl my-4">Locked</h1>
      <p className="text-muted-foreground">
        Looks like it&apos;s your first time here, let&apos;s set up a few
        things first!
      </p>

      <form className="flex flex-col w-[95%] max-w-[400px] mt-8 gap-2 border px-7 py-5 rounded-md">
        <Label htmlFor="name">Default namespace</Label>
        <Input
          id="name"
          placeholder="My accounts"
          required
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        <p className="text-muted-foreground text-sm">
          It&apos;s like naming a folder where your data will go.
        </p>
        <Button className="btn-primary" type="submit">
          Create
        </Button>
      </form>
    </div>
  );
}
