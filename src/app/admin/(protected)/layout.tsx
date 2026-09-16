import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { isDbConfigured } from "@/lib/mongodb";
import { ContactMessageModel } from "@/models";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { signOutAction } from "@/actions/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  let unreadCount = 0;
  if (isDbConfigured()) {
    try {
      unreadCount = await ContactMessageModel.countDocuments({ read: false });
    } catch {
      unreadCount = 0;
    }
  }

  return (
    <div className="flex min-h-svh bg-sidebar/40">
      <AdminSidebar
        unreadCount={unreadCount}
        signOutButton={<SignOutButton action={signOutAction} />}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
