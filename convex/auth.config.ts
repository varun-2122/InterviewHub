/**
 * Auth configuration connecting Clerk and Convex backend.
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