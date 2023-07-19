const addTodoBtn = document.getElementById("add-btn")
const todoTextBox = document.getElementById("addNewTodoText")

addTodoBtn.addEventListener("click", () => {
    let todoInputText = todoTextBox.value
    if(todoInputText){
        addTodoToDOM(todoInputText);
    }
})

function addTodoToDOM(todo){
    const todoList = document.getElementById("todoList")
    const todoItem = document.createElement("li")
    const todoData = document.createElement("span")
    
    const todoItemChkBox = document.createElement("input")
    todoItemChkBox.setAttribute('type', 'checkbox')
    todoItemChkBox.setAttribute('class', 'isMarked')
    
    const todoItemEdtBtn = document.createElement("button")
    todoItemEdtBtn.setAttribute('class', 'edit-btn')
    todoItemEdtBtn.innerHTML = "&#128393";

    const todoItemDltBtn = document.createElement("buttom")
    todoItemDltBtn.setAttribute('class', 'delete-btn')
    todoItemDltBtn.innerHTML = "&#x2716";

    todoData.innerText = todo
    todoItem.appendChild(todoData)
    todoItem.appendChild(todoItemChkBox)
    todoItem.appendChild(todoItemEdtBtn)
    todoItem.appendChild(todoItemDltBtn)

    todoList.appendChild(todoItem)

}