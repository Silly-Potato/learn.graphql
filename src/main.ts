const {ApolloServer, gql} = require('apollo-server')
const {users, posts} = require('./data')

const typeDefs = gql`
type User {
    id: Int
    email: String
    password: String
    firstName: String
    lastName: String
}

type Post {
    id: Int
    author: User
    comments: Post
    content: String
    createdAt: String
    updatedAt: String
}

type Query {
    users: [User]
    posts: [Post]
    post: [Post]
}
`;

const resolvers = {
    Query: {
        users: () => users,
        posts: () => posts,
        post: (id : any) => posts[id]
    }
}

const server = new ApolloServer({typeDefs, resolvers})
server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});