import { Pencil1Icon } from "@radix-ui/react-icons";
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
import useAuth from "@/hooks/use-auth";
import useData from "@/hooks/use-data";

export function UpdateNameDialog() {
  const { client } = useAuth();
  const { profile, refreshProfile } = useData();

  const [name, setName] = useState(profile?.display_name || "");
  const isValid = name.trim().length > 0;

  const clear = () => {
    setName(profile?.display_name || "");
  };

  const handleUpdate = async () => {
    const result = await client.profile
      .updateProfile({
        display_name: name,
      })
      .catch(() => false);
    if (result) {
      clear();
      refreshProfile();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={"w-full justify-start gap-2 px-3 cursor-pointer"}
          variant="ghost"
        >
          <Pencil1Icon />
          Update name
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
        </div>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild disabled={!isValid}>
            <Button type="button" onClick={handleUpdate} disabled={!isValid}>
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
