var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var _a = require('apollo-server'), ApolloServer = _a.ApolloServer, gql = _a.gql;
var _b = require('./data'), users = _b.users, posts = _b.posts;
var typeDefs = gql(__makeTemplateObject(["\ntype User {\n    id: Int\n    email: String\n    password: String\n    firstName: String\n    lastName: String\n}\n\ntype Post {\n    id: Int\n    author: User\n    comments: Post\n    content: String\n    createdAt: String\n    updatedAt: String\n}\n\ntype Query {\n    users: [User]\n    user(id: Int!): User\n    posts: [Post]\n    post(id: Int!): Post\n    comments(post_id: Int!): [Post]\n    comment(post_id: Int!, comment_id: Int!): Post\n}\n\ntype Mutation {\n    register(firstName: String!, lastName: String, email:String!, password: String): User\n}\n"], ["\ntype User {\n    id: Int\n    email: String\n    password: String\n    firstName: String\n    lastName: String\n}\n\ntype Post {\n    id: Int\n    author: User\n    comments: Post\n    content: String\n    createdAt: String\n    updatedAt: String\n}\n\ntype Query {\n    users: [User]\n    user(id: Int!): User\n    posts: [Post]\n    post(id: Int!): Post\n    comments(post_id: Int!): [Post]\n    comment(post_id: Int!, comment_id: Int!): Post\n}\n\ntype Mutation {\n    register(firstName: String!, lastName: String, email:String!, password: String): User\n}\n"]));
var id_counter = 0;
function generateId() {
    id_counter++;
    console.log("Generated new id: " + id_counter);
    return (id_counter);
}
function queryById(array, id) {
    for (var i = 0; i < array.length; i++) {
        console.log(array[i].id);
        if (array[i].id == id) {
            return array[i];
        }
    }
    console.log("Item with id " + id + " not found.");
    return undefined;
}
function queryUserById(id) {
    return queryById(users, id);
}
function queryPostById(id) {
    return queryById(posts, id);
}
function queryCommentsFromPost(id) {
    var post = queryPostById(id);
    if (post != undefined) {
        return post.comments;
    }
    return undefined;
}
function queryCommentById(post_id, comment_id) {
    var post = queryPostById(post_id);
    return queryById(post, comment_id);
}
function mutationRegister(firstName, lastName, email, password) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].email == email) {
            console.log("Email already in use: \"" + email + "\"");
            return undefined;
        }
    }
    var user = {
        id: generateId(),
        email: email,
        firstName: firstName,
        lastName: lastName
    };
    users.push(user);
    return user;
}
var resolvers = {
    Query: {
        users: function () {
            console.log("Query all users");
            return users;
        },
        user: function (_, _a) {
            var id = _a.id;
            console.log("Query user with id: \"" + id + "\"");
            return queryUserById(id);
        },
        posts: function () {
            console.log("Query all posts");
            return posts;
        },
        post: function (_, _a) {
            var id = _a.id;
            console.log("Query post with id: \"" + id + "\"");
            return queryPostById(id);
        },
        comments: function (_, _a) {
            var post_id = _a.post_id;
            console.log("Query comments from post with id: \"" + post_id + "\"");
            return queryCommentsFromPost(post_id);
        },
        comment: function (_, _a) {
            var post_id = _a.post_id, comment_id = _a.comment_id;
            console.log("Query comment with id: " + comment_id + ", in post with id: \"" + post_id + "\"");
            return queryCommentById(post_id, comment_id);
        }
    },
    Mutation: {
        register: function (_, _a) {
            var firstName = _a.firstName, lastName = _a.lastName, email = _a.email, password = _a.password;
            console.log("Mutation register user with email: \"" + email + "\"");
            return mutationRegister(firstName, lastName, email, password);
        }
    }
};
var server = new ApolloServer({ typeDefs: typeDefs, resolvers: resolvers });
server.listen().then(function (_a) {
    var url = _a.url;
    id_counter = users.length + posts.length;
    console.log("Server ready at " + url);
});
//# sourceMappingURL=main.js.map