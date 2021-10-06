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
    user(id: Int!): User
    posts: [Post]
    post(id: Int!): Post
    comments(post_id: Int!): [Post]
    comment(post_id: Int!, comment_id: Int!): Post
}
`;

function queryById(array, id: number) {
    for (var i: number = 0; i < array.length; i++) {
        console.log(array[i].id)
        if (array[i].id == id) {
            return array[i]
        }
    }
    console.log(`Item with id ${id} not found.`)
    return undefined;
}

function queryUserById(id: number) {
    console.log(`Query user with id: ${id}`);
    return queryById(users, id)
}

function queryPostById(id: number) {
    console.log(`Query post with id: ${id}`);
    return queryById(posts, id)
}
    
function queryCommentsFromPost(id: number) {
    var post = queryPostById(id);
    if (post != undefined) {
        return post.comments
    }
    return undefined;
}

function queryCommentById(post_id: number, comment_id: number) {
    var post = queryPostById(post_id);
    return queryById(post, comment_id);
}

const resolvers = {
    Query: {
        users: () => users,
        user: (_, {id}) => { return queryUserById(id); },
        posts: () => posts,
        post: (_, {id}) => { return queryPostById(id); },
        comments: (_, {post_id}) => { return queryCommentsFromPost(post_id); },
        comment: (_, {post_id, comment_id}) => { return queryCommentById(post_id, comment_id); }
    }
};

const server = new ApolloServer({typeDefs, resolvers})
server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});