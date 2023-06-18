import { ApolloServer, gql } from "apollo-server";

let movies = [
  {
    id: "1",
    title: "movie1",
    year: 2023,
    rating: 9.1,
    description: "this is movie1",
  },
  {
    id: "2",
    title: "movie2",
    year: 2011,
    rating: 7.3,
    description: "this is movie2",
  },
];

let directors = [
  {
    id: 9000001,
    firstname: "Bong",
    lastname: "Joonho",
  },
  {
    id: 9000002,
    firstname: "Park",
    lastname: "Chanwook",
  },
];
const typeDefs = gql`
  type Movie {
    id: ID
    title: String
    year: Int
    rating: Float
    description: String
  }
  type Director {
    id: ID!
    firstname: String!
    lastname: String!
    fullname: String!
  }
  type Query {
    directors: [Director!]!
    movies: [Movie!]!
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
    directors() {
      return directors;
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
  Director: {
    fullname({ firstname, lastname }) {
      return `${firstname} ${lastname}`;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
