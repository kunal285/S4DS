import { redirect } from "next/navigation";

export const metadata = {
  title: "Join S4DS | S4DS MITAOE",
  description:
    "Join the Society for Data Science (S4DS) Student Chapter at MIT Academy of Engineering, Alandi.",
};

export default function JoinPage() {
  redirect("/membership");
}
