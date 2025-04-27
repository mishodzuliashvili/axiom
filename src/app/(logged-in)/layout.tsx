import { ifNotAuthenticatedRedirect } from "@/lib/auth";
import { KEY_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await ifNotAuthenticatedRedirect();

  return children;
}
