import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Settings, User, ShieldAlert, KeyRound, Building2 } from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const organizationId = session.session.activeOrganizationId;

  if (!organizationId) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Organization Settings</h1>
        <p className="text-muted-foreground">Select an organization to view settings.</p>
      </div>
    );
  }

  // Fetch organization info
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!org) {
    return <div className="p-8">Organization not found</div>;
  }

  return (
    <div className="flex-1 space-y-8 p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Organization Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization profile and members.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Card */}
        <div className="border rounded-xl p-6 bg-card space-y-4 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Profile</h2>
              <p className="text-sm text-muted-foreground">Your workspace identity</p>
            </div>
          </div>
          <div className="grid gap-1">
            <span className="text-sm font-medium text-muted-foreground">Name</span>
            <span className="text-base font-semibold">{org.name}</span>
          </div>
          <div className="grid gap-1">
            <span className="text-sm font-medium text-muted-foreground">Slug</span>
            <span className="text-base font-mono bg-muted/50 p-1.5 rounded-md w-fit border">{org.slug}</span>
          </div>
          <div className="grid gap-1">
            <span className="text-sm font-medium text-muted-foreground">Created</span>
            <span className="text-base">{format(new Date(org.createdAt), "MMMM d, yyyy")}</span>
          </div>
        </div>

        {/* Plan Card */}
        <div className="border rounded-xl p-6 bg-card space-y-4 shadow-sm">
           <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-600 rounded-lg flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Plan & Billing</h2>
              <p className="text-sm text-muted-foreground">Enterprise MVP Features Active</p>
            </div>
          </div>
          <div className="bg-muted p-4 rounded-lg flex items-center justify-between border">
            <div>
              <p className="font-semibold text-foreground">Free Tier</p>
              <p className="text-sm text-muted-foreground">Full engine access</p>
            </div>
            <Button variant="outline" size="sm" disabled>Upgrade</Button>
          </div>
        </div>
      </div>

      {/* Members Section */}
      <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-muted/20">
          <div>
            <h2 className="text-xl font-semibold">Members</h2>
            <p className="text-sm text-muted-foreground">
              Users with access to {org.name}
            </p>
          </div>
          <Button disabled className="gap-2">
            <KeyRound className="w-4 h-4" />
            Invite Member
          </Button>
        </div>
        
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {org.members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-semibold text-xs border">
                          {member.user.name?.charAt(0).toUpperCase() || "U"}
                       </div>
                       {member.user.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {member.user.email}
                  </TableCell>
                  <TableCell>
                     <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        member.role === 'admin' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-muted text-muted-foreground border'
                     }`}>
                        {member.role}
                     </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(member.createdAt), "MMM d, yyyy")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
