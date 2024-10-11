document.addEventListener('DOMContentLoaded', function () {
    const taskList = document.getElementById('task-list');
    const newTaskInput = document.getElementById('new-task');
    const addBtn = document.getElementById('add-btn');
    const clearBtn = document.getElementById('clear-btn');

    loadTasks(); 

    addBtn.addEventListener('click', addTask);
    newTaskInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') addTask();
    });

    taskList.addEventListener('click', handleTaskClick);
    clearBtn.addEventListener('click', clearCompleted);

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => createTaskElement(task.text, task.completed, task.important));
    }

    function addTask() {
        const taskText = newTaskInput.value.trim();
        if (taskText === '') {
            showNotification('Please enter a task!', 'error');
            return;
        }
        createTaskElement(taskText);
        newTaskInput.value = '';
        showNotification('Task added successfully!', 'success');
        saveTasks();
    }

    function createTaskElement(text, completed = false, important = false) {
        const li = document.createElement('li');
        li.classList.add('fade-in');
        if (completed) li.classList.add('completed');
        if (important) li.classList.add('important');

        li.innerHTML = `
            <div class="task-content">
                <button class="important-btn ${important ? 'active' : ''}">★</button>
                <div class="checkmark ${completed ? 'completed' : ''}"></div>
                <span class="task-text ${completed ? 'strikethrough' : ''}">${text}</span>
            </div>
            <div class="buttons">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
        saveTasks();
    }

    function handleTaskClick(e) {
        if (e.target.classList.contains('delete-btn')) {
            e.target.closest('li').remove();
            showNotification('Task deleted!', 'success');
            saveTasks();
        } else if (e.target.classList.contains('edit-btn')) {
            const li = e.target.closest('li');
            const taskText = li.querySelector('span').textContent;
            const newTaskText = prompt('Edit your task:', taskText);
            if (newTaskText && newTaskText.trim() !== '') {
                li.querySelector('span').textContent = newTaskText.trim();
                showNotification('Task updated!', 'success');
                saveTasks();
            }
        } else if (e.target.classList.contains('important-btn')) {
            const li = e.target.closest('li');
            li.classList.toggle('important');
            e.target.classList.toggle('active');
            showNotification(li.classList.contains('important') ? 'Task marked as important!' : 'Task marked as unimportant!', 'success');
            saveTasks();
        } else if (e.target.classList.contains('checkmark') || e.target.classList.contains('task-text')) {
            const li = e.target.closest('li');
            li.classList.toggle('completed');
            li.querySelector('span').classList.toggle('strikethrough');
            showNotification(li.classList.contains('completed') ? 'Task completed!' : 'Task marked as incomplete!', 'success');
            saveTasks();
        }
    }

    function clearCompleted() {
        const completedTasks = taskList.querySelectorAll('.completed');
        if (completedTasks.length > 0) {
            completedTasks.forEach(task => task.remove());
            showNotification('Completed tasks cleared!', 'success');
        } else {
            showNotification('No completed tasks to clear.', 'error');
        }
        saveTasks();
    }

    function saveTasks() {
        const tasks = Array.from(taskList.children).map(task => ({
            text: task.querySelector('span').textContent,
            completed: task.classList.contains('completed'),
            important: task.classList.contains('important')
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function showNotification(message, type) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.style.backgroundColor = type === 'error' ? '#ffb4a2' : '#ffcdb2'; 
        notification.style.color = 'black';
        notification.classList.remove('hidden');
        notification.classList.add('visible');
        setTimeout(() => {
            notification.classList.remove('visible');
            notification.classList.add('hidden');
        }, 3000);
    }
});
