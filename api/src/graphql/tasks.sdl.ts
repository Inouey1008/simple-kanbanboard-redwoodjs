export const schema = gql`
  type Task {
    id: Int!
    title: String!
    description: String
    dueDate: DateTime
    status: String!
    epicId: Int
    epic: Epic
    order: Float!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    tasks: [Task!]! @requireAuth
    task(id: Int!): Task @requireAuth
  }

  input CreateTaskInput {
    title: String!
    description: String
    dueDate: DateTime
    status: String!
    epicId: Int
    order: Float!
  }

  input UpdateTaskInput {
    title: String
    description: String
    dueDate: DateTime
    status: String
    epicId: Int
    order: Float
  }

  type Mutation {
    createTask(input: CreateTaskInput!): Task! @requireAuth
    updateTask(id: Int!, input: UpdateTaskInput!): Task! @requireAuth
    deleteTask(id: Int!): Task! @requireAuth
  }
`
