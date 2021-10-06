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
        createdAt: "11:07:23_06/10/2021",
        updatedAt: "11:07:23_06/10/2021"
    }
];
module.exports = { users: users, posts: posts };
//# sourceMappingURL=data.js.map