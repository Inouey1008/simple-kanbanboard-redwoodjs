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
    tasks: [Task!]!
    task(id: Int!): Task
    tasksByEpic(epicId: Int): [Task!]!
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
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: Int!, input: UpdateTaskInput!): Task!
    deleteTask(id: Int!): Task!
    moveTask(id: Int!, status: String!, epicId: Int, order: Float!): Task!
  }
`
