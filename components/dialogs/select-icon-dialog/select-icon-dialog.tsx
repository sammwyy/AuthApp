import { findIcons } from "@/components/cards/token-card/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PropsWithChildren, useState } from "react";

interface SelectIconDialogProps extends PropsWithChildren {
  value?: string | undefined;
  onChange?: (value: string | undefined) => void;
}

export function SelectIconDialog({
  value,
  onChange,
  children,
}: SelectIconDialogProps) {
  const [search, setSearch] = useState("");
  const icons = findIcons(search);

  const clear = () => {
    setSearch("");
  };

  return (
    <Dialog onOpenChange={clear}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader className={"gap-3 px-3"}>
          <DialogTitle>Select an Icon</DialogTitle>

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for icons..."
          />
        </DialogHeader>

        <div className="grid grid-cols-5 space-y-2 gap-2 overflow-y-scroll max-h-[600px] px-3">
          {icons.map((icon, i) => (
            <DialogClose key={i} asChild>
              <div
                className={
                  "flex flex-col gap-2  items-center justify-center select-none cursor-pointer  border p-2 rounded-md hover:bg-gray-100 hover:text-primary-foreground"
                }
                onClick={() => {
                  onChange?.(icon.name);
                  clear();
                }}
              >
                <icon.icon color="default" />
                <span
                  className={"text-center text-wrap break-words w-full text-sm"}
                >
                  {icon.name}
                </span>
              </div>
            </DialogClose>
          ))}
        </div>

        <DialogFooter className="sm:justify-start">
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
