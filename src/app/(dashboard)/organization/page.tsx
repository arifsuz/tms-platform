import { OrganizationList } from "@/modules/organization/components/organization-list";
import { CreateOrganizationModal } from "@/modules/organization/components/create-organization-modal";

export const metadata = {
  title: "Organizations | TMS",
  description: "Manage your organizations",
};

export default function OrganizationPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">
            Manage organizations you belong to or create a new one.
          </p>
        </div>
        <CreateOrganizationModal />
      </div>

      <OrganizationList />
    </div>
  );
}
