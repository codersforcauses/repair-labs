/* eslint-disable no-useless-escape */
import { NextResponse } from "next/server";
import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";

import userService from "@/services/user";
import { UserRole } from "@/types";

export default authMiddleware({
  // url routes that don't require login
  publicRoutes: [
    "/auth/login",
    "/auth/sso-callback",
    "/auth/forgot-password",
    "/auth/register"
  ],

  async afterAuth(auth, req) {
    // handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    // handle users who are authenticated
    if (auth.userId) {
      const user = await userService.getUser(auth.userId);
      const roleProtectedRoutes = buildRoleProtectedRoutes();

      // handle access to routes based on user role
      if (
        !roleProtectedRoutes[user.role].some((regex) =>
          regex.test(req.nextUrl.pathname)
        )
      ) {
        if (!req.nextUrl.pathname.startsWith("/api/")) {
          const url = req.nextUrl.clone();
          url.pathname = "/401";
          return NextResponse.rewrite(url);
        }
      }
    }
  }
});

// map of routes protected based on roles
type ProtectedRouteMap = Record<UserRole, RegExp[]>;

const buildRoleProtectedRoutes = (): ProtectedRouteMap => {
  // TODO: move protection of api routes to endpoints
  const publicRoutes = [new RegExp(PageRouteRegex.AUTH)];
  const clientRoutes = [
    ...publicRoutes,
    new RegExp(PageRouteRegex.ROOT),
    new RegExp(PageRouteRegex.REPAIR_REQUEST)
  ];
  const repairerRoutes = [
    ...clientRoutes,
    new RegExp(PageRouteRegex.REPAIR_ATTEMPT)
  ];
  const eventManagerRoutes = [
    ...clientRoutes,
    ...repairerRoutes,
    new RegExp(PageRouteRegex.EVENTS)
  ];
  const adminRoutes = [new RegExp(PageRouteRegex.ALL)];
  // TODO: organisation manager routes

  return {
    [UserRole.CLIENT]: clientRoutes,
    [UserRole.REPAIRER]: repairerRoutes,
    [UserRole.EVENT_MANAGER]: eventManagerRoutes,
    [UserRole.ADMIN]: adminRoutes,
    [UserRole.ORGANISATION_MANAGER]: eventManagerRoutes
  };
};

// middleware route
export enum PageRouteRegex {
  ROOT = "/$",
  AUTH = "/auth",
  EVENTS = "/events",
  REPAIR_REQUEST = "/repair-request$",
  REPAIR_ATTEMPT = "/repair-request",
  ALL = "/"
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
};
