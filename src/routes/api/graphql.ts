import { createYoga } from "graphql-yoga";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "../../graphql/schema";
import { resolvers } from "../../graphql/resolvers";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const yoga = createYoga({
  schema,
  context: ({ request }) => ({ request }),
  maskedErrors: process.env.NODE_ENV !== "production" ? false : {
    maskError(error: any) {
      return error; // Temporarily show errors in prod too for debugging
    }
  },
});

export const GET = yoga;
export const POST = yoga;
