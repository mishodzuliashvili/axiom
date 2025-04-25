import { KEY_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const c = await cookies();
  const userPublicKey = c.has(KEY_NAME.USER_PUBLIC_KEY);
  if (!userPublicKey) {
    redirect("/");
  }
  // we should make sure somohje that user is logged in maybe we can do some zero knowledge proof,
  // if user authenticated aka he has server should be sure
  // in that we can make some zero knowledge proof here

  //   if something wretn wrong go to specific page and say user to dletes
  //    it poublic and private keys from localstorag or u know

  //   okay let me thinkg when user goes here there should happen something
  // this page generates some key and ecnrypts it by

  // there is one way
  // 1. we have user public key and we can make some message and encrypt it with this public key and send it to user and it will
  //  send us back its decrypted version so we will know that this is real holder of this public key this random thing will be generated on server side
  //   but i dont want to do that again and again

  //   second way is that  when he sends any request he passes some kinda
  // encrypted data by private key and
  //  in middleware i verify it with public key that he is real holder
  // of this public key no other person can do that kinda message
  // that can be verfied by this public key
  redirect("/went-wrong");
  return children;
}
