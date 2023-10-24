const input = document.getElementById('newTask');
const list = document.querySelector('.container__tasks');
const sendTask = document.getElementById('sendTask');
const tasksLeftClear = document.querySelector('.container__btnTasks');
const tasksLeft = document.getElementById('tasks-left');
const clearTasks = document.getElementById('clear-tasks');
const allTasks = document.getElementById('all-tasks');
const activeTasks = document.getElementById('active-tasks');
const completedTasks = document.getElementById('completed-tasks');
const checkbox = document.getElementById('checkbox');
const listItems = JSON.parse(localStorage.getItem("Items")) || [];

let id = 0;
let tasks = null;

checkbox.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
})

listItems.forEach(item => {
    createNewItem(item.name);
    if(item.checked){
        checkedElement(item.name);
    }
})

sendTask.addEventListener('click', () => {
    if(input.value){
        updateLocalStorage(input.value);
        input.value = '';
    } else return; 
})

input.addEventListener('keyup', (e) => {
    if(e.code === 'Enter'){
        if(e.target.value){
            updateLocalStorage(e.target.value);
            e.target.value = '';
        } else return;
    }
})

function updateLocalStorage(value){
    let newItem = {
        name: value,
        checked: false
    }
    const exist = listItems.findIndex(element => element.name === value);

    if(exist >= 0){
        alert('Esse item já está na sua lista!');
    } else {
        listItems.push(newItem);
        createNewItem(value);
        localStorage.setItem("Items", JSON.stringify(listItems));
    }
}

function createNewItem(newTask){
    tasksLeftClear.style.display = 'flex';
    let newItem = document.createElement('li');
        newItem.innerHTML = `
            <i class="fa-regular fa-circle check-task"></i>
            <p class="task__title">${newTask}</p>
            <i class="fa-solid fa-xmark delete-task"></i>
        `
        newItem.classList.add('tasks');
        newItem.setAttribute('draggable', true);
        newItem.setAttribute('id', id++);
        list.insertBefore(newItem, tasksLeftClear);
        createEventListeners();
        draggableItems();
        updateTasks();
}

function createEventListeners(){
    let btnCheck = document.querySelectorAll('.check-task');
    btnCheck.forEach(item => item.addEventListener('click', checkTask));
    let btnDelete = document.querySelectorAll('.delete-task');
    btnDelete.forEach(item => item.addEventListener('click', deleteTask));
}

function checkTask(e){
    e.target.className = 'fa-solid fa-circle-check';
    e.target.style.color = 'var(--color-primary)';
    e.target.parentNode.classList.add('checked');
    e.target.nextElementSibling.style.textDecoration = 'line-through';
    e.target.removeEventListener('click', checkTask);

    const elementToBeChecked = e.target.nextElementSibling.innerText;
    const index = listItems.findIndex(element => element.name === elementToBeChecked);
    listItems[index].checked = true;
    localStorage.setItem("Items", JSON.stringify(listItems));    
    updateTasks();
}

function checkedElement(item){
    let allItems = [...document.querySelectorAll('.tasks')];
    const index = allItems.findIndex(element => element.innerText === item);
    const icon = allItems[index].children[0];
    const task = allItems[index].children[1];
    icon.className = 'fa-solid fa-circle-check';
    icon.style.color = 'var(--color-primary)';
    task.style.textDecoration = 'line-through';
}

function deleteTask(e){
    e.target.parentNode.remove();
    const elementToBeDeleted = e.target.previousElementSibling.innerText;
    listItems.splice(listItems.findIndex(element => element.name === elementToBeDeleted), 1);
    localStorage.setItem("Items", JSON.stringify(listItems));
    if(!e.target.parentNode.classList.contains('checked')){
        updateTasks();
    } else return;   
}

function updateTasks(){
    let totalOfCheckedItems = 0;
    let allTasks = 0;
    listItems.forEach(element => {
        allTasks++;
        if(element.checked){
            totalOfCheckedItems++;
        }
    });

    if((allTasks - totalOfCheckedItems) !== 0){
        tasksLeft.innerHTML = `${allTasks - totalOfCheckedItems} tarefas restantes`;
    } else {
        tasksLeft.innerHTML = '';
        clearAllTasks();
    } 
}

clearTasks.addEventListener('click', clearAllTasks);

function clearAllTasks(){
    let allItems = document.querySelectorAll('.tasks');
    allItems.forEach(item => item.remove());
    listItems.splice(0);
    localStorage.setItem("Items", JSON.stringify(listItems));
    tasksLeftClear.style.display = 'none';
}

allTasks.addEventListener('click', () => {
    let allItems = [...document.querySelectorAll('.tasks')];
    allItems.forEach(element => {
        element.style.display = 'flex';
    })
})

activeTasks.addEventListener('click', () => {
    let allItems = [...document.querySelectorAll('.tasks')];
    allItems.forEach(element => {
        element.style.display = 'none';
    })
    let activeItems = allItems.filter(item => !item.classList.contains('checked'));
    activeItems.forEach(element => {
        element.style.display = 'flex';
    })
})

completedTasks.addEventListener('click', () => {
    let allItems = [...document.querySelectorAll('.tasks')];
    allItems.forEach(element => {
        element.style.display = 'none';
    })
    let checkedItems = allItems.filter(item => item.classList.contains('checked'));
    checkedItems.forEach(element => {
        element.style.display = 'flex';
    })
})

function draggableItems(){
    let allItems = document.querySelectorAll('.tasks');
    allItems.forEach(item => item.addEventListener('dragstart', dragStart));
    allItems.forEach(item => item.addEventListener('dragover', dragOver));
    allItems.forEach(item => item.addEventListener('drop', dropItem));
}

function dragStart(e){
    e.dataTransfer.setData('text/plain', e.target.id);
}

function dragOver(e){
    e.preventDefault();
}

function dropItem(e){
    let allItems = [...document.querySelectorAll('.tasks')];
    const newPosition = e.target;
    const id = e.dataTransfer.getData('text/plain');
    const draggingEl = document.getElementById(id);
    const draggedIndex = allItems.indexOf(draggingEl);
    let droppedIndex;
    
    if(newPosition.tagName === 'LI'){
        droppedIndex = allItems.indexOf(newPosition);
        if(draggedIndex > droppedIndex){
            newPosition.insertAdjacentElement('beforebegin', draggingEl);
        } 
        if(droppedIndex > draggedIndex){
            newPosition.insertAdjacentElement('afterend', draggingEl)
        }        
    } else {
        droppedIndex = allItems.indexOf(newPosition.parentNode);
        if(draggedIndex > droppedIndex){
            newPosition.parentNode.insertAdjacentElement('beforebegin', draggingEl);
        } 
        if(droppedIndex > draggedIndex){
            newPosition.parentNode.insertAdjacentElement('afterend', draggingEl)
        }        
    }
}


