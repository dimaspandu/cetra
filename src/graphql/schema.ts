import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String
  }

  type Upload {
    id: ID!
    userId: ID!
    imageUrl: String!
    createdAt: String!
  }

  type Analysis {
    id: ID!
    uploadId: ID!
    materialType: String!
    category: String!
    itemImagePrompt: String!
    condition: String!
    usability: String!
    recyclability: String!
    suggestions: [Suggestion!]!
    createdAt: String
  }

  type Suggestion {
    id: ID!
    type: String! # reuse, recipe, diy, resale, donation, recycling
    title: String!
    description: String!
    difficulty: String
    timeEstimate: String
    tools: [String!]
    value: String
    impact: String
    imagePrompt: String
  }

  type Tutorial {
    id: ID!
    analysisId: ID!
    steps: [String!]!
    difficulty: String!
    timeEstimate: String!
    tools: [String!]
  }

  type Query {
    uploads(userId: ID!): [Upload!]!
    analyses(uploadId: ID!): [Analysis!]!
    tutorials(analysisId: ID!): [Tutorial!]!
    archive(category: String, search: String): [Analysis!]!
  }

  type Mutation {
    uploadImage(userId: ID!, image: Upload!): Upload!
    analyzeImage(uploadId: ID!, imageBase64: String!): Analysis!
    generateTutorial(analysisId: ID!): Tutorial!
  }
`;
