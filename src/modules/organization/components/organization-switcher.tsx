"use client";

import { Check, ChevronsUpDown, Building } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export function OrganizationSwitcher() {
  const { data: organization, isPending } = authClient.useActiveOrganization();
  const { data: organizations, isPending: isListPending } = authClient.useListOrganizations();

  if (isPending || isListPending) {
    return <Skeleton className="h-10 w-full" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between border-sidebar-border bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <div className="flex items-center gap-2 truncate">
            <Building className="h-4 w-4 shrink-0" />
            <span className="truncate text-sm font-medium">
              {organization?.name || "Select Organization"}
            </span>
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56" align="start">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Organizations
        </DropdownMenuLabel>
        {organizations?.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => authClient.organization.setActive({ organizationId: org.id })}
            className="flex items-center justify-between"
          >
            <span className="truncate">{org.name}</span>
            {organization?.id === org.id && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
        {organizations?.length === 0 && (
          <div className="p-2 text-xs text-muted-foreground">
            No organizations found.
          </div>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/organization" className="cursor-pointer">
            Manage Organizations
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
