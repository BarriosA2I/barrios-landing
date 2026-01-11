import { redirect } from "next/navigation";
export default function CommandPage() { redirect("/#command"); }
export const metadata = { title: "Command Center | Barrios A2I", description: "Your private assistant command center" };
