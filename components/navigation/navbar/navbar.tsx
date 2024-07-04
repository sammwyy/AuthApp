import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAuth from "@/hooks/use-auth";
import useColorMode from "@/hooks/use-color-mode";
import useData from "@/hooks/use-data";
import useMobile from "@/hooks/use-mobile";

import {
  ExitIcon,
  GearIcon,
  LockClosedIcon,
  MoonIcon,
  SunIcon,
} from "@radix-ui/react-icons";

// Namespace settings.
function NavbarNamespacePicker() {
  const isMobile = useMobile();
  const { namespaces, selectedNamespace, setSelectedNamespace } = useData();

  return (
    <Select
      value={selectedNamespace?.id}
      onValueChange={(newID) => {
        const newNamespace = namespaces.find(
          (namespace) => namespace.id === newID
        );
        if (newNamespace) {
          setSelectedNamespace(newNamespace);
        }
      }}
    >
      <SelectTrigger
        className={`rounded-none border-transparent text-left ${
          isMobile
            ? "font-bold text-xl max-w-[350px]"
            : "border-b-primary max-w-[250px]"
        }`}
      >
        <SelectValue
          className="text-gray-600"
          placeholder="No namespace selected"
        />
      </SelectTrigger>
      <SelectContent>
        {namespaces.map((namespace) => (
          <SelectItem key={namespace.id} value={namespace.id}>
            {namespace.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// User settings.
interface NavbarUserButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

function NavbarUserButton({ onClick, icon, children }: NavbarUserButtonProps) {
  return (
    <MenubarItem
      onClick={onClick}
      className={"w-full justify-start gap-2 px-3 cursor-pointer"}
    >
      {icon}
      <span>{children}</span>
    </MenubarItem>
  );
}

function NavbarUser() {
  const { client } = useAuth();

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger
          className={"hover:bg-accent hover:text-accent-foreground h-9 w-9"}
        >
          <GearIcon className={"size-5"} />
        </MenubarTrigger>

        <MenubarContent>
          <NavbarUserButton icon={<LockClosedIcon />} onClick={() => {}}>
            Change password
          </NavbarUserButton>

          <NavbarUserButton icon={<ExitIcon />} onClick={client.auth.logout}>
            Logout
          </NavbarUserButton>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export function Navbar() {
  const { logged } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const isMobile = useMobile();

  return (
    <nav className="bg p-4">
      <div className={`${!isMobile && "container"} flex items-center`}>
        {!isMobile && (
          <div className="w-full flex justify-start">
            <h1 className="font-bold text-3xl">AuthApp</h1>
          </div>
        )}

        {logged && (
          <div className={`w-full flex ${!isMobile && "justify-center"}`}>
            <NavbarNamespacePicker />
          </div>
        )}

        <div className="w-full flex items-center justify-end">
          {logged && (
            <>
              <NavbarUser />
            </>
          )}

          <Button size={"icon"} variant={"ghost"} onClick={toggleColorMode}>
            {colorMode === "light" ? <SunIcon /> : <MoonIcon />}
          </Button>
        </div>
      </div>
    </nav>
  );
}
