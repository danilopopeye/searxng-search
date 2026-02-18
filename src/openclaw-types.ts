/**
 * OpenClaw Plugin SDK Types
 *
 * Minimal type definitions for OpenClaw plugin development.
 * These types represent the plugin API provided by the OpenClaw runtime.
 */

// ---------------------------------------------------------------------------
// Logger
// ---------------------------------------------------------------------------

export interface Logger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  debug(message: string): void;
}

// ---------------------------------------------------------------------------
// Tool Registration
// ---------------------------------------------------------------------------

export interface ToolDefinition {
  /** Human-readable label for the tool */
  label: string;
  /** Unique tool identifier */
  name: string;
  /** Description for LLM to understand tool capabilities */
  description: string;
  /** JSON Schema for input parameters */
  parameters: Record<string, unknown>;
  /** Tool execution function */
  execute(
    toolCallId: string,
    args: unknown,
  ): Promise<{ content: Array<{ type: string; text: string }>; details: unknown }>;
}

export interface ToolOptions {
  /** Whether the tool is optional (requires allowlist) */
  optional?: boolean;
}

// ---------------------------------------------------------------------------
// Plugin API
// ---------------------------------------------------------------------------

export interface OpenClawPluginApi {
  /** Logger instance for plugin logging */
  logger: Logger;
  /** Plugin configuration from OpenClaw config */
  pluginConfig: unknown;
  /** Register a tool with the platform */
  registerTool(tool: ToolDefinition, options?: ToolOptions): void;
}
