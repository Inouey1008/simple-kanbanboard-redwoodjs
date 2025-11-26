import type { Epic } from '@prisma/client'

import { epics, epic, createEpic, updateEpic, deleteEpic } from './epics'
import type { StandardScenario } from './epics.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('epics', () => {
  scenario('returns all epics', async (scenario: StandardScenario) => {
    const result = await epics()

    expect(result.length).toEqual(Object.keys(scenario.epic).length)
  })

  scenario('returns a single epic', async (scenario: StandardScenario) => {
    const result = await epic({ id: scenario.epic.one.id })

    expect(result).toEqual(scenario.epic.one)
  })

  scenario('creates a epic', async () => {
    const result = await createEpic({
      input: { name: 'String', updatedAt: '2025-11-26T16:44:53.495Z' },
    })

    expect(result.name).toEqual('String')
    expect(result.updatedAt).toEqual(new Date('2025-11-26T16:44:53.495Z'))
  })

  scenario('updates a epic', async (scenario: StandardScenario) => {
    const original = (await epic({ id: scenario.epic.one.id })) as Epic
    const result = await updateEpic({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a epic', async (scenario: StandardScenario) => {
    const original = (await deleteEpic({ id: scenario.epic.one.id })) as Epic
    const result = await epic({ id: original.id })

    expect(result).toEqual(null)
  })
})
