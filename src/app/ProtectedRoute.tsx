"use client";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "./UserContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useUser();
  const router = useRouter();
  const isFirstRender = useRef(true);
  const [shouldShow, setShouldShow] = useState(false);

  console.log("ProtectedRoute render; user:", user);

  useEffect(() => {
    if (isFirstRender.current || user === undefined) {
      isFirstRender.current = false;
      return;
    }

    if (user === null) {
      console.log("User is null, redirecting to /login");
      const timeoutId = setTimeout(() => {
        router.push("/Login");
      }, 1500);
      return () => clearTimeout(timeoutId);
    } else {
      setShouldShow(true);
      console.log("User authenticated:", user);
    }
  }, [user, router]);

  if (!shouldShow) {
    return <div>Loading authentication status...</div>;
  }

  return <>{children}</>;
}
