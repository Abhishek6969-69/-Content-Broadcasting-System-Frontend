"use client";

import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";

export default function PrincipalLayout({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user || user.role !== "PRINCIPAL") return null;

  return <AppLayout>{children}</AppLayout>;
}
