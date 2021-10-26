require('dotenv/config');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { verify } = require('jsonwebtoken');
const { hash, compare } = require('bcryptjs');

const {fakeDB } = require('./fakedb');

// 1. Register a user
// 2. Login a user
// 3. Logout a user
// 4. Setup a protected route
// 5. Get a new accesstoken with a refresh token

const server = express();

// use express middleware for easier cookie handling
server.use(cookieParser());

server.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);

// Needed to be able to read body data
server.use(express.json()); 
server.use(express.urlencoded({ extended: true}));

server.listen(process.env.PORT, () =>
    console.log(`Server listening on port ${process.env.PORT}`),
);

server.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check if user exists
        const user = fakeDB.find(user => user.email === email);

        if ( user ) {
            throw new Error('User already exists');
        }

        const hashedPassword = await hash(password, 10);

        fakeDB.push({
            id: fakeDB.length,
            email,
            password: hashedPassword
        });

        res.send({ message: 'User Created'});
        console.log(fakeDB);

    } catch (err) {
        res.send({
            error: `${err.message}`,
        });
    }
});