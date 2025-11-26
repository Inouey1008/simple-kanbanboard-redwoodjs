import type {
  QueryResolvers,
  MutationResolvers,
  TaskRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const tasks: QueryResolvers['tasks'] = () => {
  return db.task.findMany()
}

export const task: QueryResolvers['task'] = ({ id }) => {
  return db.task.findUnique({
    where: { id },
  })
}

export const createTask: MutationResolvers['createTask'] = ({ input }) => {
  return db.task.create({
    data: input,
  })
}

export const updateTask: MutationResolvers['updateTask'] = ({ id, input }) => {
  return db.task.update({
    data: input,
    where: { id },
  })
}

export const deleteTask: MutationResolvers['deleteTask'] = ({ id }) => {
  return db.task.delete({
    where: { id },
  })
}

// Custom queries for Kanban board
export const tasksByEpic: QueryResolvers['tasksByEpic'] = ({ epicId }) => {
  return db.task.findMany({
    where: {
      epicId: epicId,
    },
    orderBy: [
      { status: 'asc' },
      { order: 'asc' },
    ],
  })
}

// Custom mutations for drag & drop
export const moveTask: MutationResolvers['moveTask'] = async ({
  id,
  status,
  epicId,
  order,
}) => {
  return db.task.update({
    where: { id },
    data: {
      status,
      epicId,
      order,
    },
  })
}

export const Task: TaskRelationResolvers = {
  epic: (_obj, { root }) => {
    return db.task.findUnique({ where: { id: root?.id } }).epic()
  },
}
