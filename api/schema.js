import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers.js';

// wrapping in [] declares that the value will be a list

const typeDefs = `
    
    type User {
        id: ID!
        email: String!
        fullname: String!
        bio: String
        items: [Item]
        borrowed: [Item]
    }

    type Item {
        id: Int!
        title: String!
        description: String!
        imageurl: String!
        tags: [Tag]!
        itemowner: User!
        created: Int!
        available: Boolean!
        borrower: User
    }

    input AssignedTag {
        id: Int!
    }

    type Tag {
        id: Int!
        title: String!
    }

    type Query {
        users: [User]
        user(id: ID!): User
        items: [Item]
        item(id: ID!): Item
        tags: [Tag]
    }

    type Mutation {
        addItem (
            title: String!
            description: String!
            imageurl: String!
            tags: [AssignedTag]!
            itemowner: ID!
        ): Item

        addUser(
            fullname: String!
            bio: String
            email: String!
            password: String! 
        ): User
  }

`;

export default makeExecutableSchema({ 
    typeDefs: typeDefs,
    resolvers: resolvers
 });