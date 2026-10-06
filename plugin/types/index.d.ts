export type Limit = { kind: string; percentUsed: number; resetsAt?: string }
export type Live = { model: string; effort: string }
export type Pending = { model: string; effort: string }
export type Timer = { at: number; text: string }
export type Draft = { h: number; m: number; isSet: boolean }

declare module 'claude-code' {
  interface PluginState {
    'ClauDiscombobulating': { limits: Limit[]; live: Live; pending: Pending; flag: string; log: string[]; paneUp: boolean; timer: Timer; draft: Draft; showResetAt: boolean; cacheLeft: number; activeAt: number; alerted: number; compactedFor: string }
  }
}
