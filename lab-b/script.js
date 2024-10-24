document.addEventListener('DOMContentLoaded', () => {
    const taskInput= document.getElementById('task-input')
    const taskDeadline= document.getElementById('task-deadline')
    const taskList= document.getElementById('task-list')
    const searchInput= document.getElementById('search')
    const addTaskBtn = document.getElementById('add-task')

    let tasks = JSON.parse(localStorage.getItem('tasks'));
    //let test = [["Task 1", "2024-10-05T09:47"], ["Task 2", "2024-10-05T09:47"], ["Task 3", "2024-10-05T09:47"]]

    const renderTask = () => {

        taskList.innerHTML = ''
        let index = 0

        tasks.forEach((element) => {
            const item = document.createElement('div')
            item.style.display = 'flex'
            item.style.justifyContent = 'center'
            item.style.alignItems = 'center'
            item.style.gap = '20px'
            item.style.margin = '10px 0 0'

            item.innerHTML = `${element[0]} ${element[1]} <button id="${index}">Delete</button>`;

            const deleteTaskBtn = item.querySelector('button')
            deleteTaskBtn.addEventListener('click', ((index) => {deleteTask(index)}))

            index++;
            taskList.append(item)
        })
    }

    const addTask = () => {
        let input = taskInput.value
        let deadLine = taskDeadline.value

        if (input.trim() === '' || deadLine.trim() === '') {
            alert('Błąd');
            return;
        }

        let newTab = [input, deadLine]

        tasks.push(newTab)
        localStorage.setItem('tasks', JSON.stringify(tasks))
        renderTask()
    }

    const deleteTask = (index) => {
        tasks.splice(index, 1)
        localStorage.setItem('tasks', JSON.stringify(tasks))

        searchInput.value.trim() === '' ? renderTask() : searchTask()
    }

    const searchTask = () => {
        const input = searchInput.value
        taskList.innerHTML = ''

        tasks.forEach((element, index) => {
            const taskName = element[0]

            if(taskName.includes(input)) {
                const item = document.createElement('div')
                const reg = new RegExp(input, 'gi')

                item.style.textAlign = 'center'
                item.style.gap = '20px';
                item.style.margin = '10px 0 0';


                const highlight = element[0].replace(reg, (match) => {
                    return `<span style="background-color: #99CCFF; text-align: center">${match}</span>`
                })

                item.innerHTML = `${highlight} ${element[1]} <button class="delete-btn" data-index="${index}">Usuń</button>`;

                const deleteTaskBtn = item.querySelector('button');
                deleteTaskBtn.addEventListener('click', () => deleteTask(index));

                taskList.appendChild(item);
            }
        })
    }

    addTaskBtn.addEventListener('click', addTask);
    searchInput.addEventListener('input', searchTask);
    renderTask()
});
