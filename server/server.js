const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Data sementara (diganti dengan database di aplikasi yang lebih kompleks)
let todos = [];

// Rute untuk mendapatkan semua todo
app.get('/api/todos', (req, res) => {
    res.json(todos);
});

// Rute untuk menambahkan todo baru
app.post('/api/todos', (req, res) => {
    const newTodo = {
        id: Date.now(),
        text: req.body.text,
        completed: false
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// Rute untuk menghapus todo
app.delete('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    todos = todos.filter(todo => todo.id !== id);
    res.sendStatus(204);
});

// Rute untuk memperbarui status todo
app.put('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        res.json(todo);
    } else {
        res.sendStatus(404);
    }
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});