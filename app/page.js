import { auth } from "@/auth";
import { redirect } from "next/navigation";
import FortunePlatform from "@/components/FortunePlatform";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return <FortunePlatform />;
}
