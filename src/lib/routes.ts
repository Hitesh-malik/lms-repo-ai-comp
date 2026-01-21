// src/lib/routes.ts
export const ROUTES = {
    public: {
      home: "/",
    },
    auth: {
      login: "/auth",
      forgot: "/forget",
    },
    admin: {
      dashboard: "/admin",
    },
  } as const;
  