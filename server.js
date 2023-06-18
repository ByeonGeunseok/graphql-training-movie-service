import { ApolloServer, gql } from "apollo-server";
import fetch from "node-fetch";

let movies = [
  {
    id: "1",
    title: "movie1",
    year: 2023,
    rating: 9.1,
    description: "this is movie1",
    directorId: "9000002",
  },
  {
    id: "2",
    title: "movie2",
    year: 2011,
    rating: 7.3,
    description: "this is movie2",
    directorId: "9000001",
  },
  {
    id: "3",
    title: "movie1-1",
    year: 2024,
    rating: 0,
    description: "this is movie1-1",
    directorId: "9000001",
  },
];

let directors = [
  {
    id: "9000001",
    firstname: "Bong",
    lastname: "Joonho",
  },
  {
    id: "9000002",
    firstname: "Park",
    lastname: "Chanwook",
  },
];

const typeDefs = gql`
  """
  Movie object is ...
  """
  type Movie {
    """
    Movie Unique ID
    """
    id: ID
    """
    Movie Title
    """
    title: String
    year: Int
    rating: Float
    description: String
    director: Director
  }
  """
  Direct object is ...
  """
  type Director {
    id: ID!
    firstname: String!
    lastname: String!
    fullname: String!
  }
  type MovieList {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String!
    yt_trailer_code: String!
    language: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
  }
  type Query {
    movieList: [MovieList!]!
    directors: [Director!]!
    movies: [Movie!]!
    movie(id: ID!): Movie
    movieDetail(id: String!): MovieList
  }
  type Mutation {
    postMovie(id: ID, title: String!): Movie!
    """
    Deletes a movie if found, else returns false.
    """
    deleteMovie(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    async movieList() {
      const r = await fetch("https://yts.mx/api/v2/list_movies.json");
      const json = await r.json();
      return json.data.movies;
    },
    async movieDetail(_, { id }) {
      const r = await fetch(
        `https://yts.mx/api/v2/movie_details.json?movie_id=${id}`
      );
      const json = await r.json();
      return json.data.movie;
    },
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
  Movie: {
    director({ directorId }) {
      return directors.find((director) => director.id === directorId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
