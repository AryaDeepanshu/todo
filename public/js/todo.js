const userName = prompt("Enter your Name: ");
const addTodoBtn = document.getElementById("add-btn")
const todoTextBox = document.getElementById("addNewTodoText")
let editId =''

getTodos()

addTodoBtn.addEventListener("click", () => {
    let todoInputText = todoTextBox.value
    if(todoInputText){
        if(addTodoBtn.textContent != "save"){
            saveTodo(todoInputText, false, (error, id) => {
                if(error){
                    alert("Error: " + error)
                }else{
                    todoTextBox.value = ""
                    addTodoToDOM(todoInputText, false, id, false)
                }
            })
        }else{
            updateTodo(todoInputText,editId, userName)
        }
    }else{
        alert("Todo text is empty")
    }
})

function btnClk(id){
    if(id.slice(-1) === "d"){
        id = id.substring(0, id.length - 1)
        todoDelete(id)
    }

    if(id.slice(-1) === "c"){
        id = id.substring(0, id.length - 1)
        todoDone(id)
    }

    if(id.slice(-1) === "e"){
        id = id.substring(0, id.length - 1)
        todoEdit(id)
    }
}

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

function updateTodo(text, id, userName){
    fetch("/update?id=" + id + "&text=" + text + "&name=" + userName)
    .then(function(response){
        if(response.status != 200){
            throw new Error("Error while fetching")
        }
        return;
    }).then(function(){
        const todoList = document.getElementById("todoList")
        todoList.innerHTML=""
        getTodos()
        addTodoBtn.textContent = "Add"
        todoTextBox.value = ""
    })
    .catch(function(error){
        alert(error)
    })
}

function todoDone(id){
    fetch("/done?id=" + id)
    .then(function(response){
        if(response.status != 200){
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

function todoEdit(id){
    editId = id
    addTodoBtn.textContent = "save"
    let todoData = document.getElementById(id+"t")
    todoTextBox.value = todoData.innerText
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

function addTodoToDOM(todo, isMarked, id, isDeleted){
    if(!todo){
        return
    }
    let status = isMarked? "text-decoration: line-through":""
    let component =
    `<li><span style="${status}" id="${id}t">${todo}</span>
    <input type="checkbox" ismarked="${status}" id="${id}c" onclick="btnClk(this.id)">
    <button class="edit-btn" id="${id}e" onclick="btnClk(this.id)">🖉</button>
    <buttom class="delete-btn" id="${id}d" onclick="btnClk(this.id)">✖</buttom></li>`
    
    todoList.innerHTML += component
}