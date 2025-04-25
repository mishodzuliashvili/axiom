import { KEY_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const c = await cookies();
  if (c.has(KEY_NAME.USER_PUBLIC_KEY)) {
    redirect("/dashboard");
  }
  // if cookie has public key redirect to dashboard

  return <div>landign pgae</div>;
}
