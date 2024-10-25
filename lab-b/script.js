document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input')
    const taskDeadline = document.getElementById('task-deadline')
    const taskList = document.getElementById('task-list')
    const searchInput = document.getElementById('search')
    const addTaskBtn = document.getElementById('add-task')

    let tasks = JSON.parse(localStorage.getItem('tasks')) || []

    const renderTask = () => {
        taskList.innerHTML = ''

        tasks.forEach((element, index) => {
            const item = createTaskElement(element, index)
            taskList.append(item)
        })
    }

    const createTaskElement = (element, index) => {
        const item = document.createElement('div')
        item.style.display = 'flex'
        item.style.justifyContent = 'center'
        item.style.alignItems = 'center'
        item.style.gap = '20px'
        item.style.margin = '10px 0 0'

        const taskName = createTaskDisplay(element[0], index, 0)
        const taskDate = createTaskDisplay(element[1], index, 1)

        const deleteBtn = document.createElement('button')
        deleteBtn.textContent = 'Delete'
        deleteBtn.addEventListener('click', () => deleteTask(index))

        item.append(taskName, taskDate, deleteBtn)
        return item
    }

    const createTaskDisplay = (value, index, subIndex) => {
        const display = document.createElement('div')
        display.textContent = value
        display.style.cursor = 'pointer'
        display.style.textAlign = 'center'
        display.style.border = 'none'
        display.style.background = 'transparent'
        display.dataset.index = index
        display.dataset.subIndex = subIndex

        display.addEventListener('click', () => {
            const input = document.createElement('input')
            input.value = value
            input.type = 'text'
            input.style.cursor = 'pointer'
            input.style.border = '1px solid black'
            input.style.textAlign = 'center'

            input.addEventListener('blur', () => {
                display.textContent = input.value
                tasks[index][subIndex] = input.value

                localStorage.setItem('tasks', JSON.stringify(tasks))
                renderTask()
            })

            display.innerHTML = ''
            display.appendChild(input)
            input.focus()
        })

        return display
    }

    const addTask = () => {
        let input = taskInput.value
        let deadLine = taskDeadline.value

        if (input.trim() === '' || deadLine.trim() === '') {
            alert('Błąd')
            return
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
        const input = searchInput.value.trim()
        taskList.innerHTML = ''

        tasks.forEach((element, index) => {
            const taskName = element[0]

            if (taskName.includes(input)) {
                const item = createTaskElement(element, index)
                highlightSearchTerm(item, taskName, input)
                taskList.append(item)
            }
        })
    }

    const highlightSearchTerm = (item, taskName, input) => {
        const reg = new RegExp(`(${input})`, 'gi')
        const taskNameDisplay = item.children[0]

        taskNameDisplay.innerHTML = taskName.replace(reg, (match) => {
            return `<span style="background-color: #99CCFF">${match}</span>`
        })
    }

    searchInput.addEventListener('input', () => {
        if (searchInput.value.trim() === '') {
            renderTask()
        } else {
            searchTask()
        }
    })

    addTaskBtn.addEventListener('click', addTask)
    renderTask()
})
