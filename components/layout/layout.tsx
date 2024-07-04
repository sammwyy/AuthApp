import { PropsWithChildren, useEffect } from "react";

import useAuth from "@/hooks/use-auth";
import useData from "@/hooks/use-data";
import { useRouter } from "next/router";
import Navbar from "../navigation/navbar";

const AUTH_PAGES = ["/app/login", "/app/register", "/app/auth"];

export default function Layout({ children }: PropsWithChildren) {
  const { pathname, push: navigateTo } = useRouter();
  const { logged } = useAuth();
  const { namespaces, profile } = useData();
  const needOnboarding =
    !profile ||
    !profile.decryption_key ||
    !profile.encryption_key ||
    !namespaces.length;

  const isAuthPage = AUTH_PAGES.includes(pathname || "");
  const isOnboardingPage = pathname === "/app/onboarding";

  useEffect(() => {
    if (isAuthPage && logged) {
      navigateTo("/app");
    } else if (!isAuthPage && !logged) {
      navigateTo("/app/auth");
    } else if (needOnboarding && logged && !isOnboardingPage) {
      navigateTo("/app/onboarding");
    }
  }, [isAuthPage, navigateTo, logged, needOnboarding, isOnboardingPage]);

  return (
    <div>
      <Navbar />

      {children}
    </div>
  );
}
