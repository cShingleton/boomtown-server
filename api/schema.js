import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers.js';

// wrapping in [] declares that the value will be a list

const typeDefs = `
    
    type User {
        id: ID!
        email: String!
        fullName: String!
        bio: String
        items: [Item]
        borrowed: [Item]
    }

    type Item {
        id: Int!
        title: String!
        description: String!
        imageUrl: String!
        tags: [String]!
        itemOwner: User!
        createdOn: Int!
        available: Boolean!
        borrower: User
    }

    type Query {
        users: [User]
        user(id: ID!): User
        items: [Item]
        item(id: ID!): Item
    }

    type Mutation {
        addItem (
            title: String!
            description: String!
            imageUrl: String!
            tags: [String]!
            itemOwner: ID!
        ): Item
  }

`;

export default makeExecutableSchema({ 
    typeDefs: typeDefs,
    resolvers: resolvers
 });