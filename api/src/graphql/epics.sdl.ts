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
    epics: [Epic!]! @skipAuth
    epic(id: Int!): Epic @skipAuth
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
    createEpic(input: CreateEpicInput!): Epic! @skipAuth
    updateEpic(id: Int!, input: UpdateEpicInput!): Epic! @skipAuth
    deleteEpic(id: Int!): Epic! @skipAuth
  }
`
