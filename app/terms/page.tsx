import { redirect } from "next/navigation";
export default function TermsPage() { redirect("/#terms"); }
export const metadata = { title: "Terms of Service | Barrios A2I", description: "Terms and conditions" };
