import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div `
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f4f4f4;
  min-height: 100vh;
`;

const Title = styled.h1 `
  color: #333;
  margin-bottom: 20px;
`;

const InputContainer = styled.div `
  display: flex;
  margin-bottom: 20px;
  width: 80%;
  max-width: 500px;
`;

const Input = styled.input `
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px 0 0 5px;
  font-size: 16px;
`;

const AddButton = styled.button `
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const TodoListContainer = styled.ul `
  list-style: none;
  padding: 0;
  width: 80%;
  max-width: 500px;
`;

const TodoItem = styled.li `
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #eee;
  border-radius: 5px;
  background-color: white;
`;

const TodoText = styled.span `
  flex-grow: 1;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  color: ${props => props.completed ? '#888' : '#333'};
`;

const ActionButton = styled.button `
  background-color: ${props => props.type === 'delete' ? '#dc3545' : '#28a745'};
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
  font-size: 14px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.type === 'delete' ? '#c82333' : '#1e7e34'};
  }
`;

function App() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async() => {
        try {
            const response = await axios.get('http://localhost:5000/api/todos');
            setTodos(response.data);
        } catch (error) {
            console.error('Gagal mengambil todo:', error);
        }
    };

    const addTodo = async() => {
        if (newTodo.trim()) {
            try {
                const response = await axios.post('http://localhost:5000/api/todos', { text: newTodo });
                setTodos([...todos, response.data]);
                setNewTodo('');
            } catch (error) {
                console.error('Gagal menambahkan todo:', error);
            }
        }
    };

    const deleteTodo = async(id) => {
        try {
            await axios.delete(`http://localhost:5000/api/todos/${id}`);
            setTodos(todos.filter(todo => todo.id !== id));
        } catch (error) {
            console.error('Gagal menghapus todo:', error);
        }
    };

    const toggleComplete = async(id) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/todos/${id}`);
            setTodos(todos.map(todo =>
                todo.id === id ? {...todo, completed: response.data.completed } : todo
            ));
        } catch (error) {
            console.error('Gagal memperbarui status todo:', error);
        }
    };

    return ( <
        Container >
        <
        Title > Daftar Tugas < /Title> <
        InputContainer >
        <
        Input type = "text"
        placeholder = "Tambahkan tugas baru..."
        value = { newTodo }
        onChange = {
            (e) => setNewTodo(e.target.value) }
        onKeyPress = {
            (e) => e.key === 'Enter' && addTodo() }
        /> <
        AddButton onClick = { addTodo } > Tambah < /AddButton> <
        /InputContainer> <
        TodoListContainer > {
            todos.map(todo => ( <
                TodoItem key = { todo.id } >
                <
                TodoText completed = { todo.completed } > { todo.text } < /TodoText> <
                div >
                <
                ActionButton type = "button"
                onClick = {
                    () => toggleComplete(todo.id) } > { todo.completed ? 'Batal Selesai' : 'Selesai' } <
                /ActionButton> <
                ActionButton type = "delete"
                onClick = {
                    () => deleteTodo(todo.id) } >
                Hapus <
                /ActionButton> <
                /div> <
                /TodoItem>
            ))
        } <
        /TodoListContainer> <
        /Container>
    );
}

export default App;