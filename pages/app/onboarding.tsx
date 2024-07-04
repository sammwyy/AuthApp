import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import useAuth from "@/hooks/use-auth";
import useData from "@/hooks/use-data";
import useEncryption from "@/hooks/use-encryption";
import { generateKeyPair } from "@/lib/cipherUtils";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

export default function Onboarding() {
  const { client } = useAuth();
  const { profile, namespaces } = useData();
  const {} = useEncryption();

  const [password, setPassword] = useState("");

  const needCreateProfile = !profile;
  const needCreateTokens = !profile?.decryption_key || !profile?.encryption_key;
  const needCreateNamespace = !namespaces.length;

  const steps = [needCreateProfile, needCreateTokens, needCreateNamespace];
  const completedSteps = steps.filter((step) => !step).length;
  const progress = (completedSteps / steps.length) * 100;
  const progressText = `${completedSteps}/${steps.length}`;

  const currentStep = steps.findIndex((step) => step);
  useEffect(() => {
    if (needCreateTokens) {
      const lastPassword = sessionStorage.getItem("last_used_password");
      if (!lastPassword) {
        client.auth.logout();
      }
    }
  }, [needCreateProfile, needCreateTokens, needCreateNamespace, client]);

  async function handleGenerateKeys() {
    const { privateKey, publicKey } = await generateKeyPair();
    console.log({ privateKey, publicKey });
  }

  return (
    <div className="flex flex-col items-center justify-center mt-[100px]">
      <h1 className="text-3xl font-bold">Welcome to AuthApp!</h1>
      <p className="mt-2 text-gray-500">
        Let&apos;s get started by setting your session ({progressText})
      </p>

      <Progress value={progress} className="max-w-[300px] my-5" />

      <div
        className={
          "border-input border rounded-sm px-4 py-2 max-w-[300px] w-full flex-col gap-3"
        }
      >
        {currentStep === 0 && (
          <Alert className="border-none">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Your profile isn&apos;t ready yet.</AlertTitle>
            <AlertDescription>
              Maybe you need to verify your email address.
            </AlertDescription>
          </Alert>
        )}

        {currentStep === 1 && (
          <>
            <p className="text-sm">
              We use a client-side encryption system to protect your data. You
              need to generate a pair of keys to start using the app.
            </p>

            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Your current password"
              className={"w-full my-2"}
            />

            <Label className="text-xs text-gray-500">
              We will store your keys encrypted with your password
            </Label>

            <Button
              className={"w-full my-2"}
              onClick={handleGenerateKeys}
              disabled={!password.trim().length}
            >
              Generate keys
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
