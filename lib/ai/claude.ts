import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db/prisma";

const apiKey = process.env.ANTHROPIC_API_KEY;
export const anthropic = apiKey ? new Anthropic({ apiKey }) : null;

export interface ClaudeCallOptions {
  useCase: string;
  promptId: string;
  prompt: string;
  system?: string;
  model?: string;
  maxTokens?: number;
  userId?: string;
  jsonMode?: boolean;
}

export interface ClaudeCallResult<T = string> {
  text: string;
  parsed?: T;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  model: string;
}

/**
 * Central wrapper for every Claude call.
 * - Logs input, output, tokens, and latency to AICall table
 * - Handles JSON parsing when jsonMode = true
 * - Falls back gracefully with a clear error if API key is missing
 */
export async function callClaude<T = unknown>(
  opts: ClaudeCallOptions
): Promise<ClaudeCallResult<T>> {
  if (!anthropic) {
    throw new Error(
      "ANTHROPIC_API_KEY is not configured. Set it in your .env or Render environment variables."
    );
  }

  const model = opts.model ?? "claude-sonnet-4-5";
  const maxTokens = opts.maxTokens ?? 2048;
  const started = Date.now();

  const message = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    system: opts.system,
    messages: [{ role: "user", content: opts.prompt }],
  });

  const latencyMs = Date.now() - started;
  const textBlocks = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text);
  const text = textBlocks.join("\n").trim();

  let parsed: T | undefined;
  if (opts.jsonMode) {
    parsed = safeParseJSON<T>(text);
  }

  // Fire-and-forget audit log
  prisma.aICall
    .create({
      data: {
        userId: opts.userId,
        useCase: opts.useCase,
        promptId: opts.promptId,
        model,
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
        latencyMs,
        request: { prompt: opts.prompt, system: opts.system },
        response: { text },
      },
    })
    .catch((err: unknown) => console.error("[claude] audit log failed:", err));

  return {
    text,
    parsed,
    inputTokens: message.usage.input_tokens,
    outputTokens: message.usage.output_tokens,
    latencyMs,
    model,
  };
}

function safeParseJSON<T>(text: string): T | undefined {
  // Strip ```json fences if present
  const cleaned = text.replace(/```json\s*|```/g, "").trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // Try to find first JSON array or object in the text
    const match = cleaned.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
    if (match) {
      try {
        return JSON.parse(match[1]) as T;
      } catch {
        return undefined;
      }
    }
    return undefined;
  }
}
