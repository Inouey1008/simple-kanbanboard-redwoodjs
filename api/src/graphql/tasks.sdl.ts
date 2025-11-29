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
    tasks: [Task!]! @skipAuth
    task(id: Int!): Task @skipAuth
    tasksByEpic(epicId: Int): [Task!]! @skipAuth
  }

  input CreateTaskInput {
    title: String!
    description: String
    dueDate: DateTime
    status: String
    epicId: Int
    order: Float
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
    createTask(input: CreateTaskInput!): Task! @skipAuth
    updateTask(id: Int!, input: UpdateTaskInput!): Task! @skipAuth
    deleteTask(id: Int!): Task! @skipAuth
    moveTask(id: Int!, status: String!, epicId: Int, order: Float!): Task! @skipAuth
  }
`
