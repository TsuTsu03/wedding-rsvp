import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { getAdminData } from "@/lib/admin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Wedding Dashboard" };

export default async function AdminPage() {
  if (!isAuthed()) redirect("/admin/login");
  const data = await getAdminData();
  return <AdminDashboard data={data} />;
}
