const userName = prompt("Enter your Name: ");

const addTodoBtn = document.getElementById("add-btn")
const todoTextBox = document.getElementById("addNewTodoText")

function saveTodo (todo, isMarked, callback){
    fetch('/todo', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({text: todo, createdBy : userName, isMarked: isMarked })
      }).then(function (response) {
        if(response){
            callback()
        }else{
            callback("Something went wrong")
        }
    })
}

addTodoBtn.addEventListener("click", () => {
    let todoInputText = todoTextBox.value
    if(todoInputText){
        saveTodo(todoInputText, false, (error) => {
            if(error){
                alert("Error: " + error)
            }else{
                addTodoToDOM(todoInputText, false)
            }
        })
    }else{
        alert("Todo text is empty")
    }
})

function addTodoToDOM(todo, isMarked){
    if(!todo){
        return
    }
    let status = isMarked? "text-decoration: line-through":""
    const todoList = document.getElementById("todoList")
    const todoItem = document.createElement("li")
    const todoData = document.createElement("span")
    
    const todoItemChkBox = document.createElement("input")
    todoItemChkBox.setAttribute('type', 'checkbox')
    todoItemChkBox.setAttribute('ismarked', status)
    todoItemChkBox.checked = status
    
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

