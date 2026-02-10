import { auth } from "@/auth";

export async function getSessionEmail() {
  const session = await auth();
  return session?.user?.email || null;
}
