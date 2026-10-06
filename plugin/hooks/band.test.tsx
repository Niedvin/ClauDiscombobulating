import { expect, mock, test } from 'claude-code/testing'

const BAND = { hasSurvey: false, isWorking: false, maxRows: 20, bodyColumns: 100, scroll: { offset: 0, bodyRows: 20 }, view: {} }

test('desktop app (start surface null, then attach): only limits and cache', { timeoutMs: 20000 }, async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const calls: string[] = []
  on('session.usage', () => ({ value: {
    startedAt: 0,
    context: { window: 200000 },
    rateLimits: [
      { kind: 'five_hour', percentUsed: 8, resetsAt: '2026-10-02T12:00:00Z' },
      { kind: 'seven_day', percentUsed: 74 },
    ],
  } }))
  on('session.start', (_$, e) => ({ cwd: e.cwd }))
  on('session.attach', (_$, e) => ({ clientId: e.clientId }))
  on('turn.start', (_$, e) => ({ turnId: e.turnId }))
  on('turn.complete', () => ({ text: '' }))
  on('command.run', (_$, e) => {
    calls.push(`command ${e.command}`)
    return {}
  })
  on('command.register', (_$, e) => {
    calls.push(`register ${e.name}`)
    return { value: { command: e.name } }
  })
  on('tool.register', (_$, e) => {
    calls.push(`tool ${e.name}`)
    return { value: { tool: e.name } }
  })
  on('ui.open', () => {
    calls.push('open')
    return { value: { isPlaced: true } }
  })
  on('ui.render', { component: 'AbovePrompt' }, ($, e) => {
    const { Text } = $.ui.resolve(e)
    return <Text>ENGINE</Text>
  })
  await $.session.start({ cwd: '/', surface: null, isInteractive: false })
  await $.session.attach({ surface: 'desktop', clientId: 'desktop:default' })
  await $.turn.start({ text: 'hi', turnId: 't1' })
  await $.turn.complete({ answer: 'ok', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer' })
  await clock.advance(6 * 60000)

  const band = await $.ui.mount({ plugin: 'prompt-bar', surface: 'desktop', component: 'AbovePrompt', props: BAND })
  expect(JSON.stringify(await band.drawn())).toContain('ENGINE')

  const mode = await $.ui.mount({ plugin: 'prompt-bar', surface: 'desktop', component: 'SessionMode', props: { modes: [] } })
  const s = JSON.stringify(await mode.drawn())
  expect(s).toContain('5г')
  expect(s).toContain('"74"')
  expect(s).toContain('7д')
  expect(s).toContain('кеш 54хв')
  expect(calls).toEqual([])
})
