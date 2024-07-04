import { PlusIcon } from "@radix-ui/react-icons";
import { useState } from "react";

import { getIcon } from "@/components/cards/token-card/icons";
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
import useMobile from "@/hooks/use-mobile";
import { TokenType } from "@/lib/client";
import { isValidTOTP, TOTPAlgorithm, TOTPAlgorithms } from "@/lib/tokenUtils";
import SelectIconDialog from "../select-icon-dialog";

export function CreateTokenDialog() {
  const isMobile = useMobile();

  const { client } = useAuth();
  const { selectedNamespace, refreshTokens } = useData();

  const [name, setName] = useState("");
  const [interval, setInterval] = useState<30 | 60>(60);
  const [type, setType] = useState<TokenType>("totp");
  const [token, setToken] = useState("");
  const [algorithm, setAlgorithm] = useState<TOTPAlgorithm>("SHA-1");
  const [digits, setDigits] = useState<6 | 8>(6);
  const [icon, setIcon] = useState<string | undefined>(undefined);

  const isKeyValid = isValidTOTP(token, interval, digits, algorithm, token);
  const isValid =
    isKeyValid &&
    name.trim().length > 0 &&
    token.trim().length > 0 &&
    (interval === 30 || interval === 60);

  const IconClass = getIcon(icon || "");

  const clear = () => {
    setName("");
    setInterval(60);
    setType("totp");
    setToken("");
    setAlgorithm("SHA-1");
    setDigits(6);
    setIcon(undefined);
  };

  const handleCreate = async () => {
    const result = await client.tokens
      .createToken({
        icon,
        interval,
        name,
        namespace: selectedNamespace?.id || "",
        type,
        token,
        algorithm,
        digits,
      })
      .catch(() => false);
    if (result) {
      refreshTokens();
    }
  };

  return (
    <Dialog onOpenChange={clear}>
      <DialogTrigger asChild>
        <Button className="gap-1">
          <PlusIcon /> {isMobile ? "Add" : "Add Account"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create an Account</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-2 gap-2">
          <div className={"m-auto"}>
            <SelectIconDialog value={icon} onChange={setIcon}>
              <div className="flex gap-2 items-center">
                {IconClass ? <IconClass color={"default"} /> : <PlusIcon />}

                <Button variant={"outline"}>Change Icon</Button>
              </div>
            </SelectIconDialog>
          </div>

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
            <Label htmlFor="digits">Digits</Label>
            <Input
              type="number"
              placeholder="6"
              required
              value={digits}
              onChange={(e) => {
                setDigits(parseInt(e.target.value, 10) as 6 | 8);
              }}
            />
          </div>

          <div>
            <Label htmlFor="type">Algorithm</Label>

            <Select
              value={algorithm}
              onValueChange={(newValue) => {
                setAlgorithm(newValue as TOTPAlgorithm);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="SHA-1" />
              </SelectTrigger>
              <SelectContent>
                {TOTPAlgorithms.map((algo) => (
                  <SelectItem key={algo} value={algo}>
                    {algo}
                  </SelectItem>
                ))}
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
              className={!isKeyValid ? "border-red-500" : ""}
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
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
