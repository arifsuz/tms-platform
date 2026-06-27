import { prisma } from "@/lib/prisma";

export class AuditService {
  /**
   * Log an action to the database.
   */
  static async log(payload: {
    organizationId: string | null;
    userId: string | null;
    action: string;
    resourceType: string;
    resourceId: string;
    oldData?: any;
    newData?: any;
    ipAddress?: string | null;
  }) {
    try {
      await prisma.auditLog.create({
        data: {
          organizationId: payload.organizationId,
          userId: payload.userId,
          action: payload.action,
          resourceType: payload.resourceType,
          resourceId: payload.resourceId,
          oldData: payload.oldData || {},
          newData: payload.newData || {},
          ipAddress: payload.ipAddress,
        },
      });
    } catch (error) {
      // We don't want audit logging failures to break the main application flow
      console.error("[AUDIT_LOG_ERROR]", error);
    }
  }

  /**
   * Retrieve audit logs for an organization.
   */
  static async getLogsForOrganization(organizationId: string, limit = 50) {
    return prisma.auditLog.findMany({
      where: {
        organizationId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  }
}
