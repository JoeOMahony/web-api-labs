import './App.css';
import Task from './components/Task';
import React, { useState, useEffect } from 'react';
import AddTaskForm from './components/Form';
import { v4 as uuidv4 } from 'uuid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TaskIcon from '@mui/icons-material/Task';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/CheckCircle';
import { getTasks, addTask, deleteTask, updateTask } from "../api/tasky-api";

function App() {
  const [taskState, setTaskState] = useState({ tasks: [] });

  useEffect(() => {
    getTasks().then(tasks => {
      setTaskState({ tasks: tasks });
    });
  }, []);

  const [formState, setFormState] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "Low"
  });

  const [formAlertState, setFormAlertState] = useState(false);

  const doneHandler = (taskIndex) => {
    const tasks = [...taskState.tasks];
    tasks[taskIndex].done = !tasks[taskIndex].done;
    updateTask(tasks[taskIndex]);
    setTaskState({ tasks });
  }


  const formAlertCloseHandler = () => {
    setFormAlertState(false);
  }

  const deleteHandler = (taskIndex) => {
    const tasks = [...taskState.tasks];
    const id = tasks[taskIndex]._id;
    tasks.splice(taskIndex, 1);
    deleteTask(id);
    setTaskState({ tasks });
  }

  const formChangeHandler = (event) => {
    let form = { ...formState };

    switch (event.target.name) {
      case "title":
        form.title = event.target.value;
        break;
      case "description":
        form.description = event.target.value;
        break;
      case "deadline":
        form.deadline = event.target.value;
        break;
      case "priority":
        form.priority = event.target.value;
        break;
      default:
        form = formState;
    }

    setFormState(form);
  }

  // console.log(formState);
  const formSubmitHandler = async (event) => {
    event.preventDefault();
    const tasks = taskState.tasks ? [...taskState.tasks] : [];
    const form = { ...formState };
    const newTask = await addTask(form);
    tasks.push(newTask);
    setTaskState({ tasks });
  }


  return (
    <div className="container">
      {/* App Header */}
      <Container component="main">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          gutterBottom
          sx={{
            backgroundColor: 'navy',
            textAlign: 'center',
            color: 'white',
            padding: '20px',
            margin: '20px 0 40px 0',
            borderRadius: '50px',
            '&:hover': {
              transform: 'scale(0.99)',
              transition: 'transform 0.3s ease-in-out',
            }
          }}
        >
          <TaskIcon sx={{ margin: '20px 20px 0 0', fontSize: '48px' }} />
          Tasky
        </Typography>
      </Container>
      {/* End App Header */}

      <Divider variant="middle" sx={{ m: '4em 4em' }} />


      {/* Task Card Grid */}
      <Container maxWidth="md" component="main">
        <Grid
          container
          spacing={{ xs: 2, sm: 3, md: 4 }}
          // spacing={5}
          sx={{ justifyContent: "center" }}
        >
          {taskState.tasks.map((task, index) => (
            <Task
              title={task.title}
              description={task.description}
              deadline={task.deadline}
              priority={task.priority}
              key={task._id}
              done={task.done}
              markDone={() => doneHandler(index)}
              deleteTask={() => deleteHandler(index)}
            />
          ))}
        </Grid>
      </Container>

      {/* Alert for form submission */}
      <Snackbar
        open={formAlertState}
        autoHideDuration={3000}
        onClose={formAlertCloseHandler}
      >
        <Alert
          icon={<CheckIcon fontSize="inherit" />}
          severity="success"
          onClose={formAlertCloseHandler}
          variant="filled"
        >
          Task Completed!
        </Alert>
      </Snackbar>
      {/* End Alert for form submission */}
      {/* End Task Card Grid */}

      {/* Footer - Add Task Form */}
      <Container
        component="footer"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          my: 6,
          py: 6,
        }}
      >
        <Grid container sx={{ justifyContent: "center" }}>
          <AddTaskForm
            change={formChangeHandler}
            // onChange={(event) => props.change(event)}
            submit={formSubmitHandler}
          />
        </Grid>
      </Container>
      {/* Footer - Add Task Form */}
    </div>
  );
}

export default App;