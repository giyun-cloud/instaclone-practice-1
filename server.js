require("dotenv").config();
import { ApolloServer } from "apollo-server";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({
    req: {
      headers: { token },
    },
  }) => {
    return {
      loggedInUser: await getUser(token),
    };
  },
});

const PORT = process.env.PORT;

server
  .listen()
  .then(() => console.log(`Server is running on http://localhost:${PORT}/`));
