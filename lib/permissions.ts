// lib/permissions.ts
//
// Every authorization check in the app goes through can(). No page or API
// route should ever check `user.role === 'admin'` directly — that check
// belongs here, once, so adding a role later never means hunting through
// the codebase.

export type Role =
  | "super_admin"
  | "admin"
  | "agent"
  | "developer"
  | "notary"
  | "public_user";

export type ScopeType = "platform" | "city" | "agency" | null;

export interface SessionRole {
  role: Role;
  scopeType: ScopeType;
  scopeId: string | null;
  status: "pending" | "approved" | "suspended";
}

export interface SessionUser {
  id: string;
  roles: SessionRole[];
}

export type Action =
  | "property:create"
  | "property:edit"
  | "property:publish"
  | "property:delete"
  | "agent:approve"
  | "developer:approve"
  | "admin:manage"
  | "transaction:view"
  | "transaction:update";

export interface Resource {
  type: string;
  ownerId?: string | null;
  agencyId?: string | null;
  city?: string | null;
  participantIds?: string[];
}

function hasApprovedRole(user: SessionUser, role: Role): SessionRole[] {
  return user.roles.filter((r) => r.role === role && r.status === "approved");
}

export function can(user: SessionUser, action: Action, resource?: Resource): boolean {
  // super_admin: unrestricted
  if (hasApprovedRole(user, "super_admin").length > 0) return true;

  switch (action) {
    case "property:create":
      return hasApprovedRole(user, "agent").length > 0 || hasApprovedRole(user, "developer").length > 0;

    case "property:edit":
    case "property:delete":
      if (!resource) return false;
      if (resource.ownerId === user.id) return true;
      // city-scoped admin can edit within their city
      return hasApprovedRole(user, "admin").some(
        (r) => r.scopeType === "city" && r.scopeId === resource.city
      );

    case "property:publish":
      return hasApprovedRole(user, "admin").some(
        (r) => !resource || r.scopeType !== "city" || r.scopeId === resource.city
      );

    case "agent:approve":
    case "developer:approve":
      return hasApprovedRole(user, "admin").length > 0;

    case "admin:manage":
      // only super_admin can manage admins — already handled above
      return false;

    case "transaction:view":
    case "transaction:update":
      if (!resource) return false;
      if (resource.participantIds?.includes(user.id)) return true;
      return hasApprovedRole(user, "admin").length > 0;

    default:
      return false;
  }
}

// Convenience: does the user hold this role at all (any scope, approved)?
export function hasRole(user: SessionUser, role: Role): boolean {
  return hasApprovedRole(user, role).length > 0;
}
