import { Pencil1Icon, PlusIcon } from "@radix-ui/react-icons";
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
import { Token, TokenType } from "@/lib/client";
import { TOTPAlgorithm, TOTPAlgorithms } from "@/lib/tokenUtils";
import SelectIconDialog from "../select-icon-dialog";

interface UpdateTokenDialogProps {
  tokenData: Token;
}

export function UpdateTokenDialog({ tokenData }: UpdateTokenDialogProps) {
  const { client } = useAuth();
  const { selectedNamespace, refreshTokens } = useData();

  const [name, setName] = useState(tokenData.name);
  const [interval, setInterval] = useState<30 | 60 | undefined>(
    tokenData.interval
  );
  const [type, setType] = useState<TokenType>(tokenData.type);
  const [algorithm, setAlgorithm] = useState<TOTPAlgorithm | undefined>(
    tokenData.algorithm
  );
  const [digits, setDigits] = useState<number | undefined>(tokenData.digits);
  const [icon, setIcon] = useState<string | undefined>(undefined);

  const IconClass = getIcon(icon || "");

  const isValid =
    name && name.trim().length > 0 && (interval === 30 || interval === 60);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const reset = () => {
    setName(tokenData.name);
    setInterval(tokenData.interval);
    setType(tokenData.type);
    setAlgorithm(tokenData.algorithm);
    setDigits(tokenData.digits);
    setIcon(tokenData.icon);
  };

  const handleUpdate = async () => {
    const result = await client.tokens
      .updateToken(tokenData.id, {
        icon,
        interval,
        name,
        namespace: selectedNamespace?.id || "",
        type,
        algorithm,
        digits: digits as 6 | 8 | undefined,
      })
      .catch(() => false);
    if (result) {
      reset();
      refreshTokens();
    }
  };

  const handleDelete = async () => {
    const result = await client.tokens
      .deleteToken(tokenData.id)
      .catch(() => false);
    if (result) {
      reset();
      refreshTokens();
    }
  };

  return (
    <Dialog onOpenChange={reset}>
      <DialogTrigger
        asChild
        onClick={(e) => {
          e.stopPropagation;
        }}
      >
        <Button size={"icon"} variant={"ghost"}>
          <Pencil1Icon />
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
        </div>

        <DialogFooter className="sm:justify-between">
          <div className="flex gap-2">
            <DialogClose asChild disabled={!isValid}>
              <Button type="button" onClick={handleUpdate} disabled={!isValid}>
                Save
              </Button>
            </DialogClose>

            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
          </div>

          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="bg-red-500 hover:bg-red-700"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
