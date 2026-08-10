import { v } from "convex/values";
import { action } from "./_generated/server";
import { requireAuthAction } from "./lib";

const PISTON_API_URL = "https://emkc.org/api/v2/piston";

const LANGUAGE_VERSIONS: Record<string, string> = {
  javascript: "18.15.0",
  python: "3.10.0",
  java: "15.0.2",
};

export const executeCode = action({
  args: {
    language: v.string(),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAuthAction(ctx);

    const version = LANGUAGE_VERSIONS[args.language];
    if (!version) {
      throw new Error(`Unsupported language: ${args.language}`);
    }

    try {
      const response = await fetch(`${PISTON_API_URL}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: args.language,
          version: version,
          files: [
            {
              content: args.code,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Execution failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Code execution error:", error);
      throw new Error("Failed to execute code");
    }
  },
});
