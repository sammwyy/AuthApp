import { PlusIcon } from "@radix-ui/react-icons";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAuth from "@/hooks/use-auth";
import useData from "@/hooks/use-data";

export function CreateTokenDialog() {
  const { client } = useAuth();
  const { selectedNamespace, refreshTokens } = useData();

  const [name, setName] = useState("");
  const [interval, setInterval] = useState<30 | 60>(60);
  const [type, setType] = useState<"totp" | "hotp">("totp");
  const [token, setToken] = useState("");

  const isValid =
    name.trim().length > 0 &&
    token.trim().length > 0 &&
    (interval === 30 || interval === 60);

  const clear = () => {
    setName("");
    setInterval(60);
    setType("totp");
    setToken("");
  };

  const handleCreate = async () => {
    const result = await client.tokens
      .createToken({
        icon: "default",
        interval,
        name,
        namespace: selectedNamespace?.id || "",
        type,
        token,
      })
      .catch(() => false);
    if (result) {
      clear();
      refreshTokens();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-1">
          <PlusIcon /> Add Account
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create an Account</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-2 gap-2">
          <div>
            <Label htmlFor="name">Display name</Label>
            <Input
              type="text"
              placeholder="Business Inc"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>

          <div>
            <Label htmlFor="interval">Interval</Label>
            <Input
              type="number"
              placeholder="60"
              required
              value={interval}
              onChange={(e) => {
                setInterval(parseInt(e.target.value, 10) as 30 | 60);
              }}
            />
          </div>

          <div>
            <Label htmlFor="type">Type</Label>

            <Select
              value={type}
              onValueChange={(newValue) => {
                setType(newValue as "totp" | "hotp");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="TOTP" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="totp">TOTP</SelectItem>
                <SelectItem value="hotp">HOTP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="token">Token</Label>
            <Input
              type="password"
              placeholder="********"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild disabled={!isValid}>
            <Button type="button" onClick={handleCreate} disabled={!isValid}>
              Save
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={clear}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
