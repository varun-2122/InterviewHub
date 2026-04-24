import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";

const routerInstance = httpRouter();

// Webhook receiver parsing user sync signals sent by Clerk auth service
routerInstance.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const localSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!localSecret) {
      console.error("Setup Error: CLERK_WEBHOOK_SECRET environment variable is missing.");
      throw new Error("Missing CLERK_WEBHOOK_SECRET environment setup");
    }

    const id = request.headers.get("svix-id");
    const signature = request.headers.get("svix-signature");
    const timestamp = request.headers.get("svix-timestamp");

    if (!id || !signature || !timestamp) {
      console.warn("Invalid webhook header: Missing Svix signature headers.");
      return new Response("Missing validation headers", { status: 400 });
    }

    const payloadRaw = await request.json();
    const payloadStr = JSON.stringify(payloadRaw);

    const checkSignature = new Webhook(localSecret);
    let webhookEvent: WebhookEvent;

    try {
      webhookEvent = checkSignature.verify(payloadStr, {
        "svix-id": id,
        "svix-timestamp": timestamp,
        "svix-signature": signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Clerk payload verification signature mismatch:", err);
      return new Response("Signature mismatch", { status: 400 });
    }

    const { type: eventType, data: eventData } = webhookEvent;

    if (eventType === "user.created") {
      const { id: clerkId, email_addresses, first_name, last_name, image_url } = eventData;

      if (!email_addresses || email_addresses.length === 0) {
        return new Response("Bad Request: Clerk payload contains no email addresses", { status: 400 });
      }

      const emailAddress = email_addresses[0].email_address;
      const combinedName = `${first_name ?? ""} ${last_name ?? ""}`.trim();

      try {
        await ctx.runMutation(api.accounts.syncUserProfile, {
          clerkId: clerkId,
          email: emailAddress,
          name: combinedName || "Clerk User",
          image: image_url ?? undefined,
        });
        
        console.log(`Successfully indexed user profile: ${combinedName} (${clerkId})`);
      } catch (dbErr) {
        console.error("Database sync query failed during webhook processing:", dbErr);
        return new Response("Database write failed", { status: 500 });
      }
    }

    return new Response("Clerk webhook processed", { status: 200 });
  }),
});

export default routerInstance;
