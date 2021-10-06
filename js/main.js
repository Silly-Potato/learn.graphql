var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var _a = require('apollo-server'), ApolloServer = _a.ApolloServer, gql = _a.gql;
var _b = require('./data'), users = _b.users, posts = _b.posts;
var typeDefs = gql(__makeTemplateObject(["\ntype User {\n    id: Int\n    email: String\n    password: String\n    firstName: String\n    lastName: String\n}\n\ntype Post {\n    id: Int\n    author: User\n    comments: Post\n    content: String\n    createdAt: String\n    updatedAt: String\n}\n\ntype Query {\n    users: [User]\n    user(id: Int!): User\n    posts: [Post]\n    post(id: Int!): Post\n    comments(post_id: Int!): [Post]\n    comment(post_id: Int!, comment_id: Int!): Post\n}\n"], ["\ntype User {\n    id: Int\n    email: String\n    password: String\n    firstName: String\n    lastName: String\n}\n\ntype Post {\n    id: Int\n    author: User\n    comments: Post\n    content: String\n    createdAt: String\n    updatedAt: String\n}\n\ntype Query {\n    users: [User]\n    user(id: Int!): User\n    posts: [Post]\n    post(id: Int!): Post\n    comments(post_id: Int!): [Post]\n    comment(post_id: Int!, comment_id: Int!): Post\n}\n"]));
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
    console.log("Query user with id: " + id);
    return queryById(users, id);
}
function queryPostById(id) {
    console.log("Query post with id: " + id);
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
var resolvers = {
    Query: {
        users: function () { return users; },
        user: function (_, _a) {
            var id = _a.id;
            return queryUserById(id);
        },
        posts: function () { return posts; },
        post: function (_, _a) {
            var id = _a.id;
            return queryPostById(id);
        },
        comments: function (_, _a) {
            var post_id = _a.post_id;
            return queryCommentsFromPost(post_id);
        },
        comment: function (_, _a) {
            var post_id = _a.post_id, comment_id = _a.comment_id;
            return queryCommentById(post_id, comment_id);
        }
    }
};
var server = new ApolloServer({ typeDefs: typeDefs, resolvers: resolvers });
server.listen().then(function (_a) {
    var url = _a.url;
    console.log("Server ready at " + url);
});
//# sourceMappingURL=main.js.map