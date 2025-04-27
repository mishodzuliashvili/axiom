import { getUser } from "@/lib/auth";
import Footer from "./Footer";
import WholeNavigation from "./WholeNavigation";

export default async function WithNavbarAndFooter({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <div className="grid grid-rows-[auto_1fr_auto] grid-cols-1 min-h-screen">
      <header>
        <WholeNavigation user={user} />
      </header>
      <main className="pt-20">{children}</main>
      <div className="">
        <Footer />
      </div>
    </div>
  );
}
