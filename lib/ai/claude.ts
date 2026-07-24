import Anthropic from "@anthropic-ai/sdk";
import { AICallLog } from "../store";

/**
 * Lazily read the API key on every call so that Render env changes
 * pick up on the very next request without needing a full module reload.
 * Also trims accidental whitespace/quotes that break auth.
 */
function getAnthropic(): Anthropic {
  const raw = process.env.ANTHROPIC_API_KEY;
  if (!raw) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it in Render → Environment and save."
    );
  }
  const key = raw.trim().replace(/^["']|["']$/g, "");
  if (!key.startsWith("sk-ant-")) {
    throw new Error(
      `ANTHROPIC_API_KEY looks malformed (length ${key.length}, starts with "${key.slice(0, 8)}"). Expected it to start with "sk-ant-".`
    );
  }
  return new Anthropic({ apiKey: key });
}

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
  const client = getAnthropic();

  const model = opts.model ?? "claude-sonnet-4-5";
  const maxTokens = opts.maxTokens ?? 2048;
  const started = Date.now();

  const message = await client.messages.create({
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

/** Diagnostics helper for the /api/health/ai route */
export function aiDiagnostics() {
  const raw = process.env.ANTHROPIC_API_KEY;
  if (!raw) return { hasKey: false, reason: "env var is missing or empty" };
  const trimmed = raw.trim().replace(/^["']|["']$/g, "");
  return {
    hasKey: true,
    length: raw.length,
    trimmedLength: trimmed.length,
    hasSurroundingWhitespace: raw !== raw.trim(),
    hasSurroundingQuotes: raw !== raw.replace(/^["']|["']$/g, ""),
    startsWithSkAnt: trimmed.startsWith("sk-ant-"),
    firstEightChars: trimmed.slice(0, 8),
    lastFourChars: trimmed.slice(-4),
  };
}
