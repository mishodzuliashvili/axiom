import { ifAuthenticatedRedirect } from "@/lib/auth";
import LoginForm from "./_components/LoginForm";

export default async function LoginPage() {
  await ifAuthenticatedRedirect();

  return (
    <div>
      <LoginForm />
    </div>
  );
}
