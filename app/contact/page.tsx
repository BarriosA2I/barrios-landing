import { redirect } from "next/navigation";
export default function ContactPage() { redirect("/#contact"); }
export const metadata = { title: "Contact | Barrios A2I", description: "Get in touch with Barrios A2I" };
