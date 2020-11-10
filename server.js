const express = require('express');
const socket = require('socket.io');

const app = express();

const tasks = [
  {id: 1, value: 'go out'}, 
  {id: 2, value: 'go sleep'}, 
  {id: 3, value: 'go to work'}
];

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

const io = socket(server);

io.on('connection', (socket) => {
  socket.emit('updateData', (tasks));
  
  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', (task));
  });
  
  socket.on('removeTask', (taskID) => {
    tasks.filter(task => task.id !== taskID);
    socket.broadcast.emit('removeTask', taskID);
  });
});

app.use((req, res) => {
  res.status(404).send({message: 'Not found...'});
});
