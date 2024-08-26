// src/App.js
import React from 'react';

import TodoList from './todoList';

const Home =() => {

  return (
    <div className="container-fluid text-center mt-5 w-70">
        <h1 className='mb-5 shadow'>To Do List with React & Fetch</h1>
        <TodoList />
    </div>
  );
}

export default Home;
