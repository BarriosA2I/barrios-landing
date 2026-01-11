import { redirect } from "next/navigation";
export default function PrivacyPage() { redirect("/#privacy"); }
export const metadata = { title: "Privacy Directive | Barrios A2I", description: "Our privacy commitment" };
