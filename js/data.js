"use strict";
var users = [
    {
        id: 1,
        email: "jerry@mail.com",
        password: "1234",
        firstName: "Jerry",
        lastName: "Tartempion"
    }
];
var posts = [
    {
        id: 2,
        author: users[0],
        comments: [],
        content: "I am Jerry",
        createdAt: "06/10/2021, 11:07:23",
        updatedAt: "06/10/2021, 11:07:23"
    }
];
module.exports = { users: users, posts: posts };
//# sourceMappingURL=data.js.map