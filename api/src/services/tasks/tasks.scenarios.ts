import type { Prisma, Task } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.TaskCreateArgs>({
  task: {
    one: { data: { title: 'String', updatedAt: '2025-11-26T16:45:11.423Z' } },
    two: { data: { title: 'String', updatedAt: '2025-11-26T16:45:11.423Z' } },
  },
})

export type StandardScenario = ScenarioData<Task, 'task'>
