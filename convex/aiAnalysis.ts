import { v } from "convex/values";
import { action, mutation } from "./_generated/server";
import { requireAuth } from "./lib";
import { api } from "./_generated/api";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export const generateBehavioralAnalysis = action({
  args: {
    interviewId: v.id("interviews"),
    notes: v.string(), // Evaluator's raw notes to analyze
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    
    // In a real production setting, you would retrieve the actual transcript
    // from Stream Video recordings. For this MVP, we analyze the interviewer's notes.
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY environment variable.");
    }

    const prompt = `
      You are an expert technical recruiter. Analyze the following interview notes
      and provide a structured behavioral analysis using the STAR method
      (Situation, Task, Action, Result). 
      
      Format your response in Markdown with clear headings. Keep it concise,
      professional, and highly actionable.

      Interview Notes:
      "${args.notes}"
    `;

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate AI analysis");
      }

      const data = await response.json();
      const aiFeedback = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!aiFeedback) {
        throw new Error("AI returned an empty response.");
      }

      // Persist the feedback
      await ctx.runMutation(api.aiAnalysis.saveAiFeedback, {
        interviewId: args.interviewId,
        feedback: aiFeedback,
      });

      return aiFeedback;
    } catch (err) {
      console.error("AI Analysis Error:", err);
      throw new Error("Failed to process AI behavioral analysis.");
    }
  },
});

export const saveAiFeedback = mutation({
  args: {
    interviewId: v.id("interviews"),
    feedback: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    return await ctx.db.patch(args.interviewId, { aiFeedback: args.feedback });
  },
});
