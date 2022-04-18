const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const userExists = users.find((user) => user.username === username);
  if (!userExists)
    return response.status(404).json({ error: "Username não existe " });

  request.username = userExists;
  return next();
}

app.post("/users", (request, response) => {
    const { name, username } = request.body;
    const userExists = users.find((user) => user.username === username);
    if (userExists)
      return response.status(400).json({ error: "Username ja existe" });
    const newUser = {
      id: uuidv4(),
      name,
      username,
      todos: [],
    };
    users.push(newUser);
    response.status(201).json(newUser);
  
  
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { username } = request;
  
  return response.status(201).json(username.todos);

  // Complete aqui
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { username } = request;
  const { title, deadline } = request.body;
  const newTudos = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };
  console.log(username);
  username.todos.push(newTudos);
  return response.status(201).json(newTudos);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { username } = request;

  const { id } = request.params;

  const { title, deadline } = request.body;
  const tudo = username.todos.find((todo) => todo.id === id);
  if(!tudo) return response.status(404).json({error: "tudo nao existe"})
  tudo.title = title;
  tudo.deadline = new Date(deadline);

  return response.status(201).json(tudo);
  // Complete aqui
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const username = request.username;
  const {id} =  request.params
  const tudo = username.todos.find((todo) => todo.id === id);

  if(!tudo) return response.status(404).json({error: "not exists id"})
  tudo.done= true

 return response.status(201).json(tudo);

});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { username } = request;
  const { id } = request.params;

  const findById = username.todos.findIndex((tudo) => tudo.id === id);
  if(findById  ===-1){return response.status(404).json({error: "error"})}
  username.todos.splice(findById, 1);
  return response.status(204).json("sucess");
  // Complete aqui
});

module.exports = app;
