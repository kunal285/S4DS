import { isRouteLive } from "@/config/site-mode";
import UnderDevelopment from "@/components/UnderDevelopment";

export const metadata = {
  title: "Projects | S4DS MITAOE",
  description:
    "Explore data science and machine learning projects developed by S4DS MITAOE students.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProjectsPage() {
  return <UnderDevelopment section="Projects & Innovations" />;
}
