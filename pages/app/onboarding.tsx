import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/use-auth";
import useData from "@/hooks/use-data";
import { ExclamationTriangleIcon, LockOpen1Icon } from "@radix-ui/react-icons";
import { Label } from "@radix-ui/react-label";
import { FormEvent, useEffect, useState } from "react";

export default function OnBoardingPage() {
  const { client } = useAuth();
  const { refreshNamespaces } = useData();

  const [namespaceName, setNamespaceName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setError(null);
  }, [namespaceName]);

  const handleCreate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    client.namespaces
      .createNamespace({ name: namespaceName })
      .then(() => {
        refreshNamespaces();
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col w-full mt-20 items-center">
      <LockOpen1Icon className="w-16 h-16" />

      <h1 className="text-5xl my-4">Welcome to AuthApp!</h1>
      <p className="text-muted-foreground">
        Looks like it&apos;s your first time here, let&apos;s set up a few
        things first!
      </p>

      <form
        className="flex flex-col w-[95%] max-w-[400px] mt-8 gap-2 border px-7 py-5 rounded-md"
        onSubmit={handleCreate}
      >
        <Label htmlFor="name">Default namespace</Label>
        <Input
          id="name"
          placeholder="My accounts"
          required
          value={namespaceName}
          onChange={(e) => setNamespaceName(e.target.value)}
        />
        <p className="text-muted-foreground text-sm">
          It&apos;s like naming a folder where your data will go.
        </p>

        {error && (
          <Alert>
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error:</AlertTitle>
            <AlertDescription>
              {error || "Something went wrong, please try again."}
            </AlertDescription>
          </Alert>
        )}

        <Button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "..." : "Create"}
        </Button>
      </form>
    </div>
  );
}
