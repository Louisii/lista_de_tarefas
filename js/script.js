const todoForm = document.querySelector("#todo-form")
const todoInput = document.querySelector("#todo-input")
const todoDescriptionInput = document.querySelector("#todoDescription-input")
const todoDateTimeInput = document.querySelector("#todoDateTime-input")
const todoItemsList = document.querySelector("#todo-items")

//array com todas as tarefas
let todos = [];

// botão para adicionar tarefa 
todoForm.addEventListener('submit', function(event) {
  event.preventDefault();

  addTodo(todoInput.value, todoDescriptionInput.value, todoDateTimeInput.value); 

})

//função para adicionar tarefa
const addTodo = (item, description, dateTime) => {

  //verifica se o todoInput recebe um falor diferente de vazio
  if (item !== '' && dateTime !== '') {
    
    //objeto tarefa com id, nome, descrição, data e hora, e conclusão

    const todo = {
      id: Date.now(), 
      name: item,
      description: description,
      dateTime: dateTime,
      completed: false
    }
  
    //adiciona o objeto tarefa dentro do array de tarefas
    todos.push(todo)
    //salva array de tarefas no localStorage
    addToLocalStorage(todos)
    
    clearForm()
  }
}


//funcâo para exibir a lista de tarefas
const renderTodos = (todos) => {

  //limpa tudo dentro da tag <ul> com class= todo-items
  todoItemsList.innerHTML = ''
  
  //percorre pelos items do array de tarefas
  todos.forEach(function(item) {
    
    //verifica se a tarefa esta concluida
    const checked = item.completed ? 'checked': null
  
    const div = document.createElement('div')
  
    //adiciona class="item" ao elemento <div>
    div.setAttribute('class', 'item')
    div.setAttribute('data-key', item.id)
  
    if (item.completed === true) {
  
      div.classList.add('checked')
    }
  
    div.innerHTML = `
    <h3 data-key="${item.id}">
      <input type="checkbox" class="checkbox" ${checked}>
      ${item.name}
    </h3>

    <p class="text-break">${item.description}</p>
    <p>${item.dateTime}</p>
    <button class="delete-button btn btn-danger m-1">Apagar</button>
    <button class="edit-button btn btn-danger m-1">Editar</button>
    <button class="save-edition-btn btn btn-danger m-1" id="add-button">Salvar edição</button>
  `;
  //adiciona <li> à <ul>
  todoItemsList.append(div)
  
});
}

//função que adiciona array de tarefas no localStorage
const addToLocalStorage = (todos) => {

  //transforma array em string
  localStorage.setItem('todos', JSON.stringify(todos))
  //chama a funcâo para exibir a lista de tarefas
  renderTodos(todos)
}

//funÇão para pegar tarefas do localStorage
const getFromLocalStorage = () => {
  
  const reference = localStorage.getItem('todos')
  //se existirem tarefas no localStorage trasnformar de volta em array de objetos
  if (reference) {
    todos = JSON.parse(reference);
    //chama a funcâo para exibir a lista de tarefas
    renderTodos(todos)
  }
}


//muda o valor de não concluido e concluido
const toggle = (id) =>{

  todos.forEach(function(item) {
    // usar == e não === pois são tipos diferentes, number e string
    if (item.id == id) {
      //muda o valor
      item.completed = !item.completed
    }
  });

  addToLocalStorage(todos)
}


//funçâo para deletar tarefa da lista de tarefas
const deleteTodo = (id) => {

  let confirm = window.confirm('Tem certeza que deseja apagar a tarefa?')
  
  //confirmar para pegar tarefa
  if (!confirm){

    return;

  }else if(confirm){

    //filtra pelo id e atualiza o array
    todos = todos.filter(function(item) {
      return item.id != id
    });

    addToLocalStorage(todos)
  }
  
}

//funçâo para editar tarefa 
const editTodo = (id) => {
  
  //filtra pelo id retorna todo
  let editTodo = todos.filter(function(item) {
    return item.id = id
  });

  todoInput.value = editTodo[0].name
  todoDescriptionInput.value = editTodo[0].description
  todoDateTimeInput.value = editTodo[0].dateTime  

}

const saveEdition = (id) => {

  if (todoInput.value != "") {

    addTodo(todoInput.value, todoDescriptionInput.value, todoDateTimeInput.value)

    todos = todos.filter(function(item) {
      return item.id != id
    });

    addToLocalStorage(todos)
  }

}

const clearForm = () => {
  todoInput.value = ""
  todoDescriptionInput.value = ""
  todoDateTimeInput.value = ""
}

//botões de apagar e tarefas concluidas
getFromLocalStorage()

todoItemsList.addEventListener('click', function(event) {

  if (event.target.type === 'checkbox') {
    toggle(event.target.parentElement.getAttribute('data-key'))
  }

  if (event.target.classList.contains('edit-button')) {
    editTodo(event.target.parentElement.getAttribute('data-key'))
  }

  if (event.target.classList.contains('delete-button')) {
    deleteTodo(event.target.parentElement.getAttribute('data-key'))
  }

  if (event.target.classList.contains('save-edition-btn')) {
    saveEdition(event.target.parentElement.getAttribute('data-key'))
  }
})
