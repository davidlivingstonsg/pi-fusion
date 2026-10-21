import assert from 'node:assert/strict';
import { rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join } from 'node:path';

/** Removes a scratch root only after proving it is a Fusion temp directory. */
export async function removeScratchRoot(panelDir: string): Promise<void> {
  const root = dirname(panelDir);
  assert.ok(isAbsolute(root), `scratch root must be absolute: ${root}`);
  assert.ok(
    root.startsWith(join(tmpdir(), 'pi-fusion-')),
    `refusing to remove non-scratch path: ${root}`,
  );
  await rm(root, { recursive: true, force: true });
}

export function serializedPanelTasks(
  spawn: unknown,
): { cwd?: string; task: string; agent: string }[] {
  const script = (spawn as { script?: unknown }).script;
  assert.equal(typeof script, 'string');
  const serialized = (script as string).match(/^const tasks = (.*);$/m)?.[1];
  assert.ok(serialized, 'expected serialized panel tasks');
  return JSON.parse(serialized) as {
    cwd?: string;
    task: string;
    agent: string;
  }[];
}
