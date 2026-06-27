"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { Building, Users, Check } from "lucide-react";

export function OrganizationList() {
  const { data: organizations, isPending } = authClient.useListOrganizations();
  const { data: activeOrg } = authClient.useActiveOrganization();

  if (isPending) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (!organizations || organizations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Building className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="mt-6 text-xl font-semibold">No organizations</h2>
        <p className="mt-2 text-center text-sm font-normal leading-6 text-muted-foreground max-w-sm">
          You don't belong to any organizations yet. Create one to start managing tournaments.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {organizations.map((org) => {
        const isActive = activeOrg?.id === org.id;

        return (
          <Card key={org.id} className={isActive ? "border-primary" : ""}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  {org.name}
                </CardTitle>
                <CardDescription>Created recently</CardDescription>
              </div>
              {isActive && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  ID: {org.id.slice(0, 8)}...
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant={isActive ? "secondary" : "outline"}
                className="w-full"
                onClick={() => authClient.organization.setActive({ organizationId: org.id })}
                disabled={isActive}
              >
                {isActive ? "Active Organization" : "Set Active"}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
