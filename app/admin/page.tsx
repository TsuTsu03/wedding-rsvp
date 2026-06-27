import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { getAdminData } from "@/lib/admin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminDemoNotice } from "@/components/admin/AdminDemoNotice";

export const dynamic = "force-dynamic";
export const metadata = { title: "Wedding Dashboard" };

export default async function AdminPage() {
  if (!isAuthed()) redirect("/admin/login");
  try {
    const data = await getAdminData();
    return <AdminDashboard data={data} />;
  } catch {
    // No database reachable (e.g. preview deploy) — show guidance, don't crash.
    return <AdminDemoNotice />;
  }
}
