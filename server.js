const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'membresia')));

// Registration route
app.post('/register', (req, res) => {
    const { nombre, email, password } = req.body;
    const users = JSON.parse(fs.readFileSync('users.json'));

    if (users.find(user => user.email === email)) {
        return res.status(400).send('User already exists');
    }

    users.push({ nombre, email, password });
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));

    res.redirect('/login.html');
});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const users = JSON.parse(fs.readFileSync('users.json'));

    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        res.redirect('/dashboard.html');
    } else {
        res.status(400).send('Invalid credentials');
    }
});

// Logout route
app.get('/logout', (req, res) => {
    res.redirect('/logout.html');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
