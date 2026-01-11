import { redirect } from "next/navigation";
export default function AboutPage() { redirect("/#about"); }
export const metadata = { title: "About | Barrios A2I", description: "About Barrios A2I - The Intelligence Architecture" };
