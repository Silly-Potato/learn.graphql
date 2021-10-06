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

type Mutation {
    register(firstName: String!, lastName: String, email:String!, password: String): User
    createPost(user_id: Int!, content: String!): Post
    createComment(user_id: Int!, post_id: Int!, content: String!): Post
    updatePost(id: Int!, content: String!): Post
}
`;

var id_counter = 0

function generateId() {
    id_counter++;
    console.log(`Generated new id: ${id_counter}`)
    return (id_counter);
}

function mylog(msg: String) {
    console.log("-----------------------------------------")
    console.log(msg);
}

function queryById(array, id: number) {
    for (var i: number = 0; i < array.length; i++) {
        if (array[i].id == id) {
            return array[i]
        }
    }
    console.log(`Item with id ${id} not found.`)
    return undefined;
}

function queryUserById(id: number) {
    return queryById(users, id)
}

function queryPostById(id: number) {
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

function mutationRegister(firstName: String, lastName: String, email: String, password: String) {
    //check if email already in use
    for (var i: number = 0; i < users.length; i++) {
        if (users[i].email == email) {
            console.log(`Email already in use: \"${email}\"`)
            return undefined;
        }
    }
    var user = {
        id: generateId(),
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password
    };
    users.push(user);
    return user;
}

function mutationCreatePost(user_id: number, content: String) {
    var user = queryUserById(user_id);
    if (user == undefined) {
        console.log(`Could not create post, user undefined`);
        return undefined;
    }
    var today = new Date().toLocaleString();
    var post = {
        id: generateId(),
        author: user,
        comments: [],
        content: content,
        createdAt: today,
        updatedAt: today
    };
    posts.push(post);
    return post;
}

function mutationCreateComment(user_id: number, post_id: number, content: String) {
    var post = queryPostById(post_id);
    if (post == undefined) {
        return undefined;
    }
    var comment = mutationCreatePost(user_id, content);
    if (comment == undefined) {
        return undefined;
    }
    post.comments.push(comment);
    return comment;
}

function mutationUpdatePost(id: number, content: String) {
    var post = queryPostById(id);
    if (post == undefined) {
        return undefined;
    }
    post.content = content;
    post.updatedAt = new Date().toLocaleString();
    return post;
}

const resolvers = {
    Query: {
        users: () => {
            mylog(`Query all users`)
            return users;
        },
        user: (_, {id}) => {
            mylog(`Query user with id: \"${id}\"`);
            return queryUserById(id);
        },
        posts: () =>  {
            mylog(`Query all posts`)
            return posts;
        },
        post: (_, {id}) => { 
            mylog(`Query post with id: \"${id}\"`);
            return queryPostById(id);
        },
        comments: (_, {post_id}) => { 
            mylog(`Query comments from post with id: \"${post_id}\"`);
            return queryCommentsFromPost(post_id);
        },
        comment: (_, {post_id, comment_id}) => {
            mylog(`Query comment with id: ${comment_id}, in post with id: \"${post_id}\"`)
            return queryCommentById(post_id, comment_id); }
    },
    Mutation: {
        register: (_, {firstName, lastName, email, password}) => {
            mylog(`Mutation register user with email: \"${email}\"`)
            return mutationRegister(firstName, lastName, email, password);
        },
        createPost: (_, {user_id, content}) => {
            mylog(`Mutation create post by user with id: \"${user_id}\"`);
            return mutationCreatePost(user_id, content);
        },
        createComment: (_, {user_id, post_id, content}) => {
            mylog(`Mutation create comment by user with id: \"${user_id}\" on post with id: \"${post_id}\"`);
            return mutationCreateComment(user_id, post_id, content);
        },
        updatePost: (_, {id, content}) => {
            mylog(`Mutation update post with id: \h${id}\"`);
            return mutationUpdatePost(id, content);
        }
    }
};

const server = new ApolloServer({typeDefs, resolvers})
server.listen().then(({ url }) => {
    id_counter = users.length + posts.length;
    console.log(`Server ready at ${url}`);
});