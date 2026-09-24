import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SignOutButton } from "@/components/admin/sign-out-button";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Session gate only — all admin data is loaded through the REST API.
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="flex min-h-svh bg-sidebar/40">
      <AdminSidebar signOutButton={<SignOutButton />} />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
