import { redirect } from "next/navigation";
export default function StatusPage() { redirect("/#status"); }
export const metadata = { title: "System Status | Barrios A2I", description: "Live operational status of the neural infrastructure" };
