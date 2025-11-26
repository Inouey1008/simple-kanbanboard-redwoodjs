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
    epics: [Epic!]!
    epic(id: Int!): Epic
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
    createEpic(input: CreateEpicInput!): Epic!
    updateEpic(id: Int!, input: UpdateEpicInput!): Epic!
    deleteEpic(id: Int!): Epic!
  }
`
