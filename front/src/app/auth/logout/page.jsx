"use client";

import { useEffect } from "react";
import { useAuthContext } from "@/contexts/authContext";
import { useRouter } from "next/navigation";

export default function Page() {
  const { logout } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    logout();
    router.push("/auth/login");
  });

  return null;
}