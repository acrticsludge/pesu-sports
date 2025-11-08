"use client";
import React, { ReactNode, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "./UserContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useUser();
  const router = useRouter();
  const isFirstRender = useRef(true);

  console.log("ProtectedRoute render; user:", user);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    console.log("ProtectedRoute checking user:", user);
    if (user === null) {
      console.log("Redirecting to /login");
      router.push("Login");
    }
  }, [user, router]);

  if (user === undefined) {
    return <div>Loading authentication status...</div>;
  }

  return <>{children}</>;
}
