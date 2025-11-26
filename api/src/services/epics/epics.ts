import type {
  QueryResolvers,
  MutationResolvers,
  EpicRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const epics: QueryResolvers['epics'] = () => {
  return db.epic.findMany()
}

export const epic: QueryResolvers['epic'] = ({ id }) => {
  return db.epic.findUnique({
    where: { id },
  })
}

export const createEpic: MutationResolvers['createEpic'] = ({ input }) => {
  return db.epic.create({
    data: input,
  })
}

export const updateEpic: MutationResolvers['updateEpic'] = ({ id, input }) => {
  return db.epic.update({
    data: input,
    where: { id },
  })
}

export const deleteEpic: MutationResolvers['deleteEpic'] = ({ id }) => {
  return db.epic.delete({
    where: { id },
  })
}

export const Epic: EpicRelationResolvers = {
  tasks: (_obj, { root }) => {
    return db.epic.findUnique({ where: { id: root?.id } }).tasks()
  },
}
