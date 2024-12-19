import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLError } from "graphql";

const books = [
  {
    id: 1,
    title: "Our Inner Fish",
    author: "Neil Shubin",
  },
  {
    id: 2,
    title: "Subtle Art of Not Giving a Fuck",
    author: "Mark Manson",
  },
];

const typeDefs = `#graphql
  type Book {
    title: String
    author: String
    id: Int
  }
  type Query {
    books: [Book]
    getBooksByAuthor(author: String): [Book]
    getBookById(id: Int): Book
  }
`;

// resolvers
const resolvers = {
  Query: {
    books: () => books,
    getBooksByAuthor: (_parent, args) => {
      const authorBooks = books.filter((book) => book.author === args.author);
      if (authorBooks.length > 0) {
        return authorBooks;
      } else {
        // Throw error
        throw new GraphQLError(
          `There are no books with author ${args.author}`,
          {
            extensions: {
              code: "BOOKS_NOT_FOUND",
            },
          },
        );
      }
    },
    getBookById: (_parent, args) => {
      const bookIndex = books.findIndex((book) => book.id == args.id);
      if (bookIndex !== -1) {
        return books[bookIndex];
      } else {
        throw new GraphQLError(`There is no book with id ${args.id}`, {
          extensions: {
            code: "BOOK_NOT_FOUND",
          },
        });
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`Server is running at ${url}`);
