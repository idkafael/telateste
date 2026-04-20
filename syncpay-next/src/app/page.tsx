import { redirect } from "next/navigation";

/** Landing estática em /public/index.html — um único deploy (API + página). */
export default function Home() {
  redirect("/index.html");
}
