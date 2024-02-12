const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    
    savedBooks: [Book]!
  }

  type Book {
    _id: ID
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
    title: String
}


  type Auth {
    token: ID!
    user: User
  }

  type Query {
    
    user(username: String!, id: ID!): User
    user1(username: String!): User
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(_id: ID!, description: String, bookId: String, image: String, link: String, title: String, authors: [String]): User
    deleteBook(_id: ID!, bookId: ID!): User
  }
`;

module.exports = typeDefs;
