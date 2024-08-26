import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from "./modal";

const TodoList = () => {
    const [newTodo, setNewTodo] = useState('');
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        fetch("https://playground.4geeks.com/todo/users/eliasjr")
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch todos");
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data.todos)) { 
                    setTodos(data.todos);
                } else {
                    console.error("Data received is not an array:", data);
                }
            })
            .catch(error => console.error("Error fetching todos:", error));
    }, []);

    const addTodo = (e) => {
        if (e.key === 'Enter' && newTodo.trim() !== '') {
            const newtodo = { label: newTodo, done: false };
            setNewTodo('');

            const postData = {
                method: "POST",
                body: JSON.stringify(newtodo),
                headers: {
                    "Content-Type": "application/json"
                }
            };

            fetch("https://playground.4geeks.com/todo/todos/eliasjr", postData)
                .then(response => {
                    if (!response.ok) throw new Error("Failed to create todo");
                    return response.json();
                })
                .then(data => {
                    setTodos(prevtodos => [...prevtodos, data]);
                })
                .catch(error => console.error("Error creating todo:", error));
        }
    };

    const deleteTodo = (index) => {
        const todoToDelete = todos[index];
        const updatedtodos = todos.filter((_, i) => i !== index);
        setTodos(updatedtodos);

        const deleteData = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch(`https://playground.4geeks.com/todo/todos/${todoToDelete.id}`, deleteData)
            .then(response => {
                if (!response.ok) throw new Error("Failed to delete todo");
                return response.json();
            })
            .then(data => {
                console.log("todo deleted:", data);
            })
            .catch(error => console.error("Error deleting todo:", error));
    };

    const deleteTodos = () => {
        if (todos.length === 0) return;

        const deletePromises = todos.map(todo => {
            return fetch(`https://playground.4geeks.com/todo/todos/${todo.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });
        });

        Promise.all(deletePromises)
            .then(responses => {
                const allSuccessful = responses.every(response => response.ok);
                if (allSuccessful) {
                    console.log("All todos deleted successfully");
                    setTodos([]); 
                } else {
                    console.error("Failed to delete some todos");
                }
            })
            .catch(error => {
                console.error("Error deleting todos:", error);
            });
    };

    return (
        <div className="container w-75 mt-5" id="todoList">
            <div className="input-group shadow rounded p-3">
                <input className="form-control form-control-lg" type="text" placeholder="Añadir tarea" onChange={e => setNewTodo(e.target.value)} value={newTodo} onKeyDown={addTodo}/>
            </div>          
            <div className="shadow rounded p-3 mt-5 w-100">
                <div className="text-center">
                    <h1>Lista de Tareas</h1>
                    <ul className="list-group mt-3">
                        {todos.map((todo, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                {todo.label}
                                <button className="btn btn-danger btn-sm" onClick={() => deleteTodo(index)}>Eliminar</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="text-center mt-5">
                <button type="button" className="btn btn-danger shadow" onClick={deleteTodos}>
                    Eliminar todas las tareas
                </button>
            </div>
        </div>
    );
}

export default TodoList;
