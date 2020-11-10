import React from 'react';
import io from 'socket.io-client';
import randomID from '@bosiu/id-generator';

class App extends React.Component {
  
  state = {
    tasks: [],
    taskName: '',
  };
  
  componentDidMount() {
    this.socket = io.connect('http://localhost:8000');
    this.socket.on('updateData', (tasksArray) => { this.setState({tasks: tasksArray}) });
    this.socket.on('addTask',(newTask) => { this.addTask(newTask) });
    this.socket.on('removeTask', (taskID) => { this.removeTask(taskID) });
  };
  
  handleRemoveTask = (taskID) => {
    this.removeTask(taskID);
    this.socket.emit('removeTask', (taskID));
  };
  
  handleTaskState = (newTask) => {
    this.setState({taskName: newTask});
  };

  submitForm = (event) => {
    event.preventDefault();
    const newTask = {id: randomID(10), value: this.state.taskName};
    this.addTask(newTask);
    this.socket.emit('addTask', (newTask));
    this.setState({taskName: ''})
  };

  addTask = (newTask) => {
    this.state.tasks.push(newTask);
    this.setState({
      tasks: this.state.tasks,
    });
  };

  removeTask = (taskID) => {
    this.setState( {tasks: this.state.tasks.filter(task => task.id !== taskID)});
  };

  render() {
    const { tasks, taskName } = this.state;
    return (
      <div className="App">
        <header>
          <h1>ToDoList.app</h1>
        </header>
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map(task => (
              <li className="task" key={task.id}>{task.value}<button className="btn btn--red" onClick={() => this.handleRemoveTask(task.id)}>Remove</button></li>
            ))}
          </ul>
          <form id="add-task-form" onSubmit={event => this.submitForm(event)}>
            <input 
              className="text-input" 
              autoComplete="off" 
              type="text" 
              placeholder="Type your description" 
              id="task-name" 
              value={taskName}
              onChange={event => this.handleTaskState(event.currentTarget.value)}/>
            <button className="btn" type="submit">Add</button>
          </form>
        </section>
      </div>
    );
  };

};

export default App;