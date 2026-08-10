/**
 * Auth configuration connecting Clerk and Convex backend.
 *
 * IMPORTANT: If you are deploying this project under a new Clerk account,
 * update `domain` below to match your own Clerk instance URL.
 * You can find it at: Clerk Dashboard → API Keys → "JWT Issuer".
 * Without this change, Convex will reject all JWTs from your users.
 */
const authConfig = {
  providers: [
    {
      domain: "https://strong-giraffe-32.clerk.accounts.dev/",
      applicationID: "convex",
    },
  ],
};

export default authConfig;