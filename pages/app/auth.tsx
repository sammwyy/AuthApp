import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

import useAuth from "@/hooks/use-auth";
import useColorMode from "@/hooks/use-color-mode";

export default function AuthPage() {
  const { client } = useAuth();
  const { colorMode } = useColorMode();

  return (
    <div className={"flex items-center flex-col w-full mt-[100px]"}>
      <div className={"max-w-[500px] w-full"}>
        <Auth
          supabaseClient={client.supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          redirectTo="/app"
          theme={colorMode}
        />
      </div>
    </div>
  );
}
