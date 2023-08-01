const todoTextBox = document.getElementById("addNewTodoText")
const adbtn = document.getElementById('adbtn')
const upbtn = document.getElementById('upbtn')
const filePicker = document.getElementById('filepick')
let editId =''

getTodos()

ToggleForm(adbtn)

todoTextBox.addEventListener('keydown', function (e) {

    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        adbtn.click();
    }
});

function ToggleForm(btn){
    btn.style.visibility = "visible"
    if(btn.textContent === "Add"){
        upbtn.style.visibility = "hidden"
        filePicker.setAttribute('required', '');
    }else{
        adbtn.style.visibility = "hidden"
        filePicker.removeAttribute('required')
    }
}

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
        ele = document.getElementById("id")
        ele.value = id
        ToggleForm(upbtn)
        todoEdit(id)
    }
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
        todoImg = todo.img
        let status = (todo.isMarked)? "text-decoration: line-through":""

        let component =
        `<li><span style="${status}" id="${todoid}t">${todotext}</span>
        <img src="${todoImg}" alt="dp" width="32px" height="32px">
        <input class="done-btn" type="checkbox" ismarked="${status}" id="${todoid}c" onclick="btnClk(this.id)" ${isMarked?"checked":""}>
        <button class="edit-btn" id="${todoid}e" onclick="btnClk(this.id)">🖉</button>
        <buttom class="delete-btn" id="${todoid}d" onclick="btnClk(this.id)">✖</buttom></li>`
        todoList.insertAdjacentHTML('beforeend', component)
    });
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
    adbtn.visibility = "hidden"
    let todoData = document.getElementById(id+"t")
    todoTextBox.value = todoData.innerText

}

function updateTodo(text, id){
    fetch("/update?id=" + id + "&text=" + text)
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
        ToggleForm(adbtn)
    })
    .catch(function(error){
        alert(error)
    })
}

function todoDelete(id){
    if(adbtn.visibility === "hidden"){
        alert("Please save the todo before deleting")
        return
    }
        
    let text = document.getElementById(id+"t")
    let parent = text.parentNode
    parent.remove();
    fetch("/delete?id=" + id)
    .then(function(response){
        if(response.status !=200){
            throw new Error("Error while fetching")
        }
        return;
    })
    .then(function(){
        return
    })
    .catch(function(error){
        alert(error)
    })
}

function getTodos(){
    fetch("/todos")
    .then(res => res.json())
    .then(todos => {addTodoToDOM(todos)})
    .catch(error => alert(error))
}