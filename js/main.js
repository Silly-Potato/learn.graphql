var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var _a = require('apollo-server'), ApolloServer = _a.ApolloServer, gql = _a.gql;
var _b = require('./data'), users = _b.users, posts = _b.posts;
var typeDefs = gql(__makeTemplateObject(["\ntype User {\n    id: Int\n    email: String\n    password: String\n    firstName: String\n    lastName: String\n}\n\ntype Post {\n    id: Int\n    author: User\n    comments: Post\n    content: String\n    createdAt: String\n    updatedAt: String\n}\n\ntype Query {\n    users: [User]\n    posts: [Post]\n    post: [Post]\n}\n"], ["\ntype User {\n    id: Int\n    email: String\n    password: String\n    firstName: String\n    lastName: String\n}\n\ntype Post {\n    id: Int\n    author: User\n    comments: Post\n    content: String\n    createdAt: String\n    updatedAt: String\n}\n\ntype Query {\n    users: [User]\n    posts: [Post]\n    post: [Post]\n}\n"]));
var resolvers = {
    Query: {
        users: function () { return users; },
        posts: function () { return posts; },
        post: function (id) { return posts[id]; }
    }
};
var server = new ApolloServer({ typeDefs: typeDefs, resolvers: resolvers });
server.listen().then(function (_a) {
    var url = _a.url;
    console.log("Server ready at " + url);
});
//# sourceMappingURL=main.js.map