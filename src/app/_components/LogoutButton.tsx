"use client";
import { useRouter } from "next/navigation";
import { logout } from "../_actions/logout";
import toast from "react-hot-toast";
import { useState } from "react";
import { clearUserClient } from "@/lib/clientUserStore";
import customToast from "@/lib/toast";

export default function LogoutButton({
  className,
  children,
  onClick,
}: {
  className: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <button
      className={className}
      disabled={loading}
      onClick={async () => {
        setLoading(true);

        try {
          const res = await logout({});
          if (!res.success) {
            customToast.error("Cannot log out");
          } else {
            await clearUserClient();
            router.push("/");
            onClick && onClick();
          }
        } catch (error) {
          customToast.error("Cannot log out");
        }
      }}
    >
      {children}
    </button>
  );
}
