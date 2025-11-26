export const schema = gql`
  type Epic {
    id: Int!
    name: String!
    description: String
    createdAt: DateTime!
    updatedAt: DateTime!
    tasks: [Task]!
  }

  type Query {
    epics: [Epic!]! @requireAuth
    epic(id: Int!): Epic @requireAuth
  }

  input CreateEpicInput {
    name: String!
    description: String
  }

  input UpdateEpicInput {
    name: String
    description: String
  }

  type Mutation {
    createEpic(input: CreateEpicInput!): Epic! @requireAuth
    updateEpic(id: Int!, input: UpdateEpicInput!): Epic! @requireAuth
    deleteEpic(id: Int!): Epic! @requireAuth
  }
`
