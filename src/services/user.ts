/* eslint-disable no-unused-vars */

import { NextApiRequest } from "next";
import { clerkClient } from "@clerk/nextjs";
import { User as ClerkUser } from "@clerk/nextjs/server";
import { getAuth as getClerkAuth } from "@clerk/nextjs/server";

import { buildPaginationResponse, PaginationOptions } from "@/lib/pagination";
import { User, UserRole } from "@/types";

type ClerkOrderBy =
  | "created_at"
  | "updated_at"
  | "+created_at"
  | "+updated_at"
  | "-created_at"
  | "-updated_at";

async function getAuth(req: NextApiRequest) {
  const auth = getClerkAuth(req);

  const role = await getRole(auth.userId!);

  return {
    ...auth,
    role
  };
}

async function getMany(options: PaginationOptions) {
  const { orderBy, perPage, page, query } = options;

  const searchRequest = {
    orderBy: orderBy as ClerkOrderBy,
    limit: perPage,
    offset: (page - 1) * perPage,
    query
  };

  // getCount requires a search request too so it returns the total query count.
  const users = await clerkClient.users.getUserList(searchRequest);
  const totalCount = await clerkClient.users.getCount(searchRequest);

  return buildPaginationResponse<User>(
    users.map((user) => toResponse(user)),
    options,
    totalCount
  );
}

async function getUserMapFromIds(userIds: string[]) {
  const users = await clerkClient.users.getUserList({ userId: userIds });
  const userMap = users.reduce(
    (map, clerkUser) => {
      map[clerkUser.id] = toResponse(clerkUser);
      return map;
    },
    {} as Partial<Record<string, User>>
  );
  return userMap;
}

async function getUser(userId: string) {
  const user = await clerkClient.users.getUser(userId);
  return toResponse(user);
}

async function updateRole(userId: string, role: UserRole) {
  return await clerkClient.users.updateUser(userId, {
    publicMetadata: {
      role: role
    }
  });
}

async function getRole(userId: string): Promise<UserRole> {
  const user = await clerkClient.users.getUser(userId);
  const role = user.publicMetadata.role
    ? (user.publicMetadata.role as UserRole)
    : UserRole.CLIENT;

  return role;
}

function toResponse(user: ClerkUser): User {
  const { id, firstName, lastName, emailAddresses, publicMetadata } = user;
  const role = publicMetadata.role
    ? (publicMetadata.role as UserRole)
    : UserRole.CLIENT;
  const emailAddress = emailAddresses[0].emailAddress;

  return {
    id,
    firstName,
    lastName,
    role,
    emailAddress
  };
}

/** Used when a user cannot be found in clerk */
function unknownUser(userId: string): User {
  // TODO: stop force type casting userrole
  return {
    id: userId,
    firstName: "Unknown",
    lastName: "",
    emailAddress: "Unknown",
    role: "Unknown" as UserRole
  };
}

const userService = {
  getAuth,
  getMany,
  getUser,
  updateRole,
  getRole,
  getUserMapFromIds,
  unknownUser
};

export default userService;
