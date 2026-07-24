import Anthropic from "@anthropic-ai/sdk";
import { AICallLog } from "../store";

const apiKey = process.env.ANTHROPIC_API_KEY;
export const anthropic = apiKey ? new Anthropic({ apiKey }) : null;

export interface ClaudeCallOptions {
  useCase: string;
  promptId: string;
  prompt: string;
  system?: string;
  model?: string;
  maxTokens?: number;
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

export async function callClaude<T = unknown>(
  opts: ClaudeCallOptions
): Promise<ClaudeCallResult<T>> {
  if (!anthropic) {
    throw new Error(
      "ANTHROPIC_API_KEY is not configured. Set it in your Render environment variables."
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
  if (opts.jsonMode) parsed = safeParseJSON<T>(text);

  // Non-blocking audit log
  AICallLog.add({
    useCase: opts.useCase,
    promptId: opts.promptId,
    model,
    inputTokens: message.usage.input_tokens,
    outputTokens: message.usage.output_tokens,
    latencyMs,
    request: { prompt: opts.prompt.slice(0, 4000), system: opts.system?.slice(0, 1000) },
    response: { text: text.slice(0, 4000) },
  }).catch(() => {});

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
  const cleaned = text.replace(/```json\s*|```/g, "").trim();
  try { return JSON.parse(cleaned) as T; } catch {}
  const match = cleaned.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
  if (match) { try { return JSON.parse(match[1]) as T; } catch {} }
  return undefined;
}
