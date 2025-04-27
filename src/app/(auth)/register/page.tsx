import { cookies } from "next/headers";
import RegisterForm from "./_components/RegisterForm";
import { KEY_NAME } from "@/lib/constants";
import { redirect } from "next/navigation";
import { ifAuthenticatedRedirect } from "@/lib/auth";

export default async function RegisterPage() {
  await ifAuthenticatedRedirect();

  return (
    <div>
      <RegisterForm />
    </div>
  );
}
