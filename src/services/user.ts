/* eslint-disable no-unused-vars */

import { NextApiRequest } from "next";
import { clerkClient } from "@clerk/nextjs";
import { User as ClerkUser } from "@clerk/nextjs/server";
import { getAuth as getClerkAuth } from "@clerk/nextjs/server";

import { PaginationResponse } from "@/lib/pagination";
import { User, UserRole, UserSearchQuery } from "@/types";

type ClerkOrderBy = "created_at" | "updated_at";

async function getAuth(req: NextApiRequest) {
  const auth = getClerkAuth(req);

  const role = await getRole(auth.userId!);

  return {
    ...auth,
    role
  };
}

async function getMany(
  options: UserSearchQuery
): Promise<PaginationResponse<User[]>> {
  const { orderBy, perPage, page, query, userId } = options;

  const searchRequest = {
    orderBy: orderBy as ClerkOrderBy,
    limit: perPage,
    offset: (page - 1) * perPage,
    query,
    userId
  };

  // getCount requires a search request too so it returns the total query count.
  const users = await clerkClient.users.getUserList(searchRequest);
  const totalCount = await clerkClient.users.getCount(searchRequest);

  return {
    items: users.map((user) => toResponse(user)),
    meta: {
      totalCount,
      page,
      perPage,
      lastPage: Math.ceil(totalCount / perPage)
    }
  };
}

/**
 * Goes through and gets all users from the pagination
 * @param options - { orderBy, query, userId }
 * @returns A list of all users
 */
async function getAll(
  options: Omit<UserSearchQuery, "page" | "perPage">
): Promise<User[]> {
  const { orderBy, query, userId } = options;

  const perRequest = 499;

  const searchRequest = {
    orderBy: orderBy as ClerkOrderBy,
    offset: 0,
    limit: perRequest,
    query,
    userId
  };

  const totalCount = await clerkClient.users.getCount(searchRequest);
  const allUsers: ClerkUser[] = [];
  let page = 0;
  while (allUsers.length < totalCount) {
    const users = await clerkClient.users.getUserList({
      ...searchRequest,
      offset: page * perRequest
    });
    if (users.length == 0) break;
    allUsers.push(...users);
    page++;
  }

  return allUsers.map((user) => toResponse(user));
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
  return user ? toResponse(user) : undefined;
}

async function getUsers(userIds: string[]) {
  return await Promise.all(userIds.map((userId) => getUser(userId)));
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
  const { emailAddresses, publicMetadata, imageUrl } = user;
  const role = publicMetadata.role
    ? (publicMetadata.role as UserRole)
    : UserRole.CLIENT;
  const emailAddress = emailAddresses[0].emailAddress;

  return {
    ...user,
    role,
    emailAddress,
    imageUrl
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
  getAll,
  getUser,
  getUsers,
  updateRole,
  getRole,
  getUserMapFromIds,
  unknownUser
};

export default userService;
