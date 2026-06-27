import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { FileText, Clock, User, Activity } from "lucide-react";
import { AuditService } from "@/modules/audit/audit.service";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AuditLogsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  if (!session.session.activeOrganizationId) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Audit Logs</h1>
        <p className="text-muted-foreground">Select an organization to view logs.</p>
      </div>
    );
  }

  const logs = await AuditService.getLogsForOrganization(session.session.activeOrganizationId);

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground">
          A detailed record of all administrative actions within your organization.
        </p>
      </div>

      <div className="border rounded-md bg-card">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No Logs Yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1">
              Actions like creating tournaments or updating scores will appear here.
            </p>
          </div>
        ) : (
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Date & Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {format(new Date(log.createdAt), "MMM d, yyyy HH:mm")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {log.user?.name || "System"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" />
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-semibold">
                          {log.action}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {log.resourceType} ({log.resourceId.slice(-6)})
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
