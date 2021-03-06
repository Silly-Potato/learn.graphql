var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var _a = require('apollo-server'), ApolloServer = _a.ApolloServer, gql = _a.gql;
var _b = require('./data'), users = _b.users, posts = _b.posts;
var typeDefs = gql(__makeTemplateObject(["\ntype User {\n    id: Int\n    email: String\n    password: String\n    firstName: String\n    lastName: String\n}\n\ntype Post {\n    id: Int\n    author: User\n    comments: [Post]!\n    content: String\n    createdAt: String\n    updatedAt: String\n}\n\ntype Query {\n    users: [User]\n    user(id: Int!): User\n    posts: [Post]\n    post(id: Int!): Post\n    comments(post_id: Int!): [Post]\n    comment(post_id: Int!, comment_id: Int!): Post\n}\n\ntype Mutation {\n    register(firstName: String!, lastName: String, email:String!, password: String): User\n    createPost(user_id: Int!, content: String!): Post\n    createComment(user_id: Int!, post_id: Int!, content: String!): Post\n    updatePost(id: Int!, content: String!): Post\n    deletePost(id: Int!): Boolean\n}\n"], ["\ntype User {\n    id: Int\n    email: String\n    password: String\n    firstName: String\n    lastName: String\n}\n\ntype Post {\n    id: Int\n    author: User\n    comments: [Post]!\n    content: String\n    createdAt: String\n    updatedAt: String\n}\n\ntype Query {\n    users: [User]\n    user(id: Int!): User\n    posts: [Post]\n    post(id: Int!): Post\n    comments(post_id: Int!): [Post]\n    comment(post_id: Int!, comment_id: Int!): Post\n}\n\ntype Mutation {\n    register(firstName: String!, lastName: String, email:String!, password: String): User\n    createPost(user_id: Int!, content: String!): Post\n    createComment(user_id: Int!, post_id: Int!, content: String!): Post\n    updatePost(id: Int!, content: String!): Post\n    deletePost(id: Int!): Boolean\n}\n"]));
var id_counter = 0;
function generateId() {
    id_counter++;
    console.log("Generated new id: " + id_counter);
    return (id_counter);
}
function mylog(msg) {
    console.log("-----------------------------------------");
    console.log(msg);
}
function queryById(array, id) {
    for (var i = 0; i < array.length; i++) {
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
    return queryById(post.comments, comment_id);
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
        lastName: lastName,
        password: password
    };
    users.push(user);
    return user;
}
function mutationCreatePost(user_id, content) {
    var user = queryUserById(user_id);
    if (user == undefined) {
        console.log("Could not create post, user undefined");
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
function mutationCreateComment(user_id, post_id, content) {
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
function mutationUpdatePost(id, content) {
    var post = queryPostById(id);
    if (post == undefined) {
        return undefined;
    }
    post.content = content;
    post.updatedAt = new Date().toLocaleString();
    for (var i = 0; i < posts.length; i++) {
        var found = queryById(post[i].comments, post.id);
        if (found != undefined) {
            found = post;
        }
    }
    return post;
}
function mutationDeletePost(id) {
    var post = queryPostById(id);
    if (post == undefined) {
        return false;
    }
    var found = false;
    for (var i = 0; i < posts.length; i++) {
        post = posts[i];
        for (var j = 0; j < post.comments.length && !found; j++) {
            if (post.comments[j].id == id) {
                post.comments.splice(j, 1);
                found = true;
            }
        }
        if (post.id == id) {
            posts.splice(i, 1);
        }
    }
    return true;
}
var resolvers = {
    Query: {
        users: function () {
            mylog("Query all users");
            return users;
        },
        user: function (_, _a) {
            var id = _a.id;
            mylog("Query user with id: \"" + id + "\"");
            return queryUserById(id);
        },
        posts: function () {
            mylog("Query all posts");
            return posts;
        },
        post: function (_, _a) {
            var id = _a.id;
            mylog("Query post with id: \"" + id + "\"");
            return queryPostById(id);
        },
        comments: function (_, _a) {
            var post_id = _a.post_id;
            mylog("Query comments from post with id: \"" + post_id + "\"");
            return queryCommentsFromPost(post_id);
        },
        comment: function (_, _a) {
            var post_id = _a.post_id, comment_id = _a.comment_id;
            mylog("Query comment with id: " + comment_id + ", in post with id: \"" + post_id + "\"");
            return queryCommentById(post_id, comment_id);
        }
    },
    Mutation: {
        register: function (_, _a) {
            var firstName = _a.firstName, lastName = _a.lastName, email = _a.email, password = _a.password;
            mylog("Mutation register user with email: \"" + email + "\"");
            return mutationRegister(firstName, lastName, email, password);
        },
        createPost: function (_, _a) {
            var user_id = _a.user_id, content = _a.content;
            mylog("Mutation create post by user with id: \"" + user_id + "\"");
            return mutationCreatePost(user_id, content);
        },
        createComment: function (_, _a) {
            var user_id = _a.user_id, post_id = _a.post_id, content = _a.content;
            mylog("Mutation create comment by user with id: \"" + user_id + "\" on post with id: \"" + post_id + "\"");
            return mutationCreateComment(user_id, post_id, content);
        },
        updatePost: function (_, _a) {
            var id = _a.id, content = _a.content;
            mylog("Mutation update post with id: \"" + id + "\"");
            return mutationUpdatePost(id, content);
        },
        deletePost: function (_, _a) {
            var id = _a.id;
            mylog("Mutation delete post with id: \"" + id + "\"");
            return mutationDeletePost(id);
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