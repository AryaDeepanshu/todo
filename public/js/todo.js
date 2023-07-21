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
                    todos = [{text: todoInputText, createdBy : userName, isMarked: false, id: id, isDeleted: false}]
                    addTodoToDOM(todos)
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
        let text = document.getElementById(id+"t")
        let parent = text.parentNode
        parent.remove();

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
        let text = document.getElementById(id+"t")
        addTodoBtn.textContent = "Add"
        text.innerText = todoTextBox.value
        todoTextBox.value =""
        
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
        let text = document.getElementById(id+"t")
        if(text.style.textDecoration === "line-through"){
            text.style.textDecoration = ""
        }else{
            text.style.textDecoration = "line-through"
        }
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
        // todos.forEach(todo => {
        //     addTodoToDOM(todo.text, todo.isMarked, todo.id, todo.isDeleted)
        // });
        addTodoToDOM(todos)
    })
    .catch(function(error){
        alert(error)

    })
}

function addTodoToDOM(todos){
    if(!todos){
        return
    }
    todos.forEach(todo => {
        todoid = todo.id,
        todotext = todo.text, 
        isMarked = todo.isMarked
        isDeleted  = todo.isDeleted
        let status = (todo.isMarked)? "text-decoration: line-through":""
        let component =
        `<li><span style="${status}" id="${todoid}t">${todotext}</span>
        <input class="done-btn" type="checkbox" ismarked="${status}" id="${todoid}c" onclick="btnClk(this.id)" ${isMarked?"checked":""}>
        <button class="edit-btn" id="${todoid}e" onclick="btnClk(this.id)">🖉</button>
        <buttom class="delete-btn" id="${todoid}d" onclick="btnClk(this.id)">✖</buttom></li>`
        
        todoList.innerHTML += component
    });
    
}