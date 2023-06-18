import { ApolloServer, gql } from "apollo-server";

let movies = [
  {
    id: "1",
    title: "movie1",
    year: 2023,
    rating: 9.1,
    description: "this is movie1",
    directror: {
      id: 991,
      name: "Bong",
    },
  },
  {
    id: "2",
    title: "movie2",
    year: 2011,
    rating: 7.3,
    description: "this is movie2",
    directror: {
      id: 992,
      name: "James",
    },
  },
];
const typeDefs = gql`
  type Movie {
    id: ID
    title: String
    year: Int
    rating: Float
    description: String
    director: Director
  }
  type Director {
    id: ID
    name: String
  }
  type Query {
    movies: [Movie]
    movie(id: ID!): Movie
  }
  type Mutation {
    postMovie(id: ID, title: String!): Movie!
    deleteMovie(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    movies() {
      return movies;
    },
    movie(_, { id }) {
      return movies.find((movie) => movie.id === id);
    },
  },
  Mutation: {
    postMovie(_, { title }) {
      const newMovie = {
        id: movies.length + 1,
        title,
      };
      movies.push(newMovie);
      return newMovie;
    },
    deleteMovie(_, { id }) {
      const movie = movies.find((movie) => movie.id === id);
      if (!movie) return false;
      movies = movies.filter((movie) => movie.id !== id);
      return true;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
