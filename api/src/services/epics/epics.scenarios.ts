import type { Prisma, Epic } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.EpicCreateArgs>({
  epic: {
    one: { data: { name: 'String', updatedAt: '2025-11-26T16:44:53.522Z' } },
    two: { data: { name: 'String', updatedAt: '2025-11-26T16:44:53.522Z' } },
  },
})

export type StandardScenario = ScenarioData<Epic, 'epic'>
