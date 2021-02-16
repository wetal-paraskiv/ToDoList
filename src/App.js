import { useState, useEffect } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Tasks from './components/Tasks'
import Header from './components/Header'
import Addtask from './components/Addtask'
import Footer from './components/Footer'
import About from './components/About'


function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTasks()
  }, [])

  // fetch tasks
  const fetchTasks = async () => {
    const result = await fetch('http://localhost:5000/tasks')
    const data = await result.json()
    return data;
  }

  // fetch task
  const fetchTask = async (id) => {
    const result = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await result.json()
    return data;
  }

  // add task
  const addTask = async (task) => {
    const result = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })
    const data = await result.json()
    setTasks([...tasks, data])
  }

  // delete task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    })
    setTasks(tasks.filter((task) => task.id !== id))
  }

  // toggle the reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder }

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updTask)
    })

    const data = await res.json()

    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, reminder: data.reminder }
        : task))
  }
  // console.log(tasks);

  return (

    <BrowserRouter>
      <div className="container">

        <Header
          onAdd={() => setShowAddTask(!showAddTask)}
          showAdd={showAddTask} />
        
        <Route path='/' exact render={(props) =>
          (
          <>
            {showAddTask && <Addtask onAdd={addTask} />}
            {tasks.length > 0 ?
              <Tasks
                tasks={tasks}
                onDelete={deleteTask}
                onToggle={toggleReminder} />
              : 'No Tasks to show.'}
          </>
          )} />
        <Route path='/about' component={About} />
        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;
