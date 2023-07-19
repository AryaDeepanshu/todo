const userName = prompt("Enter your Name: ");
const addTodoBtn = document.getElementById("add-btn")
const todoTextBox = document.getElementById("addNewTodoText")



getTodos()

function saveTodo (todo, isMarked, callback){
    let d = new Date().getTime()
    fetch('/todo', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({text: todo, createdBy : userName, isMarked: isMarked, id: d, isDeleted: false})
      }).then(function (response) {
        if(response){
            callback("", d)
        }else{
            callback("Something went wrong","")
        }
    })
}

addTodoBtn.addEventListener("click", () => {
    let todoInputText = todoTextBox.value
    if(todoInputText){
        saveTodo(todoInputText, false, (error, id) => {
            if(error){
                alert("Error: " + error)
            }else{
                addTodoToDOM(todoInputText, false, id, false)
            }
        })
    }else{
        alert("Todo text is empty")
    }
})


function addTodoToDOM(todo, isMarked, id, isDeleted){
    if(!todo){
        return
    }
    let status = isMarked? "text-decoration: line-through":""
    const todoList = document.getElementById("todoList")
    const todoItem = document.createElement("li")
    const todoData = document.createElement("span")
    todoData.setAttribute('style', status)
    todoData.setAttribute('id', id+"t")   

    const todoItemChkBox = document.createElement("input")
    todoItemChkBox.setAttribute('type', 'checkbox')
    todoItemChkBox.setAttribute('ismarked', status)
    todoItemChkBox.setAttribute('id', id+"c") 
    todoItemChkBox.checked = status
    
    const todoItemEdtBtn = document.createElement("button")
    todoItemEdtBtn.setAttribute('class', 'edit-btn')
    todoItemEdtBtn.setAttribute('id', id+"e")
    todoItemEdtBtn.setAttribute('onClick', "btnClk(this.id)") 
    todoItemEdtBtn.innerHTML = "&#128393";

    const todoItemDltBtn = document.createElement("buttom")
    todoItemDltBtn.setAttribute('class', 'delete-btn')
    todoItemDltBtn.setAttribute('id', id+"d") 
    todoItemDltBtn.setAttribute('onClick', "btnClk(this.id)") 
    todoItemDltBtn.innerHTML = "&#x2716";

    todoData.innerText = todo
    todoItem.appendChild(todoData)
    todoItem.appendChild(todoItemChkBox)
    todoItem.appendChild(todoItemEdtBtn)
    todoItem.appendChild(todoItemDltBtn)

    todoList.appendChild(todoItem)
}


function btnClk(id){
    if(id.slice(-1) === "d"){
        id = id.substring(0, id.length - 1)
        todoDelete(id)
    
    }
}

function todoDelete(id){
    fetch("/delete?id=" + id)
    .then(function(response){
        if(response.status !=200){
            throw new Error("Error while fetching")
        }
        return;
    })
    .then(function(){
        const todoList = document.getElementById("todoList")
        todoList.innerHTML=""
        getTodos()

    })
    .catch(function(error){
        alert(error)

    })
}

function getTodos(){
    fetch("/todos?name=" + userName)
    .then(function(response){
        if(response.status != 200){
            throw new Error("Error while fetching")
        }
        return response.json();
    })
    .then(function(todos){
        todos.forEach(todo => {
            addTodoToDOM(todo.text, todo.isMarked, todo.id, todo.isDeleted)
        });
        
    })
    .catch(function(error){
        alert(error)

    })
}