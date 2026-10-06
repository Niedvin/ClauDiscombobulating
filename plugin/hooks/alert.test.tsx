import { expect, mock, test } from 'claude-code/testing'

test('cache alert: one toast + sound script per idle period, 10 min before miss', { timeoutMs: 30000 }, async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const runs: { argv: readonly string[]; env: Record<string, string> | undefined }[] = []
  on('session.usage', () => ({ value: { startedAt: 0, context: { window: 1 }, rateLimits: [] } }))
  on('session.start', (_$, e) => ({ cwd: e.cwd }))
  on('session.attach', (_$, e) => ({ clientId: e.clientId }))
  on('turn.start', (_$, e) => ({ turnId: e.turnId }))
  on('turn.complete', () => ({ text: '' }))
  on('ui.toast', () => ({ value: undefined }))
  on('env.get', (_$, e) => ({ value: e.name === 'OS' ? 'Windows_NT' : undefined }))
  on('process.run', (_$, e) => {
    runs.push({ argv: e.argv, env: e.init?.env })
    return { value: { exitCode: 0, stdout: '', stderr: '' } }
  })
  await $.session.start({ cwd: '/', surface: null, isInteractive: false })
  await $.session.attach({ surface: 'desktop', clientId: 'desktop:default' })
  const finish = async (id: string) => {
    await $.turn.start({ text: 'hi', turnId: id })
    await $.turn.complete({ answer: 'ok', durationMs: 1, isAborted: false, turnId: id, reason: 'answer' })
  }
  await finish('t1')
  await clock.advance(48 * 60000)
  expect(runs.length).toBe(0)

  await clock.advance(3 * 60000)
  expect(runs.length).toBe(1)
  expect(runs[0]?.argv[0]).toBe('powershell.exe')
  expect(runs[0]?.env?.PB_BODY).toBe('Кеш: лишилось 10 хв')
  expect(runs[0]?.env?.PB_SOUND).toContain('assets/cache-alert.mp3')

  await clock.advance(5 * 60000)
  expect(runs.length).toBe(1)

  await finish('t2')
  await clock.advance(51 * 60000)
  expect(runs.length).toBe(2)
})
