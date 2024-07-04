import { PropsWithChildren, useEffect } from "react";

import useAuth from "@/hooks/use-auth";
import useData from "@/hooks/use-data";
import { useRouter } from "next/router";
import Navbar from "../navigation/navbar";

export default function Layout({ children }: PropsWithChildren) {
  const { pathname, push: navigateTo } = useRouter();
  const { logged } = useAuth();
  const { namespaces } = useData();

  const isAuthPage = pathname == "/app/auth";

  const needOnboarding = logged && !namespaces?.length;
  const isOnboardingPage = pathname == "/app/onboarding";

  useEffect(() => {
    if (isAuthPage && logged) {
      navigateTo("/app");
    } else if (!isAuthPage && !logged) {
      navigateTo("/app/auth");
    } else if (needOnboarding && !isOnboardingPage) {
      navigateTo("/app/onboarding");
    } else if (!needOnboarding && isOnboardingPage) {
      navigateTo("/app");
    }
  }, [isAuthPage, navigateTo, logged, needOnboarding, isOnboardingPage]);

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
