const state = {
  taskList: [],
};

// DOM manipulations
const taskModal = document.querySelector(".task__modal__body");
const taskContent= document.querySelector(".task__contents");
//console.log(taskContent);

//  To create a card on home page
const htmlTaskContent = ({ id, title, description, type, url }) => `
<div class='col-md-6 col-lg-4 mt-3' id= ${id} key= ${id}>
  <div class='card shadow-sm task__card'>
    <div class='card-header d-flex gap-2 justify-content-end task__card__header'>
        <button type='button' class='btn btn-outline-info mr-2' name=${id}>
            <i class='fa fa-pencil-alt' name='${id}'></i>
        </button>
        <button type='button' class='btn btn-outline-danger mr-2' name=${id} onclick="deleteTask.apply(this, arguments)">
            <i class='fa fa-trash-alt' name='${id}'></i>
        </button> 
    </div>
        <div class='card-body'>
             ${
               url 
               ? `<img width='100%' height='150px' style="object-fit: cover; object-position: center" src= ${url} alt='card image cap' class='card-image-top md-3 rounded-lg'/>`
               : `<img width='100%' height='150px' style="object-fit: cover; object-position: center" src= "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBQvPxhYmISs1nE8Qfc9GsNITiBka1RustOQ&usqp=CAU" alt='card image cap' class='card-image-top md-3 rounded-lg'/>`
              }
             <h4 class='task__card__title'>${title}</h4>
             <p class='description trim-3-lines text-muted' data-gram_editor='false'>${description}</p>
             <div  class='tags text-white d-flex flex-wrap'>
                <span class='badge bg-primary m-1'>${type}</span>
             </div>
        </div>

        <div class='card-footer'>
              <button 
              type='button' 
              class='btn btn-outline-primary float-right' 
              data-bs-toggle='modal' 
              data-bs-target='#showTask'
              id=${id}
              onclick='openTask.apply(this, arguments)'>
              Open Task
              </button>
        </div>
  </div>
</div>
`;

// Dynamic Modals(cards) on our homepage/UI
const htmlModalContent= ({id, title, description, url}) => {
    const date= new Date(parseInt(id));
    return `
    <div id= ${id}>
    ${
        url 
        ? `<img width='100%' src= ${url} alt='card image here' class='img-fluid place__holder__image mb-3'/>`
        : `<img width='100%' height='150px' style="object-fit: cover; object-position: center" src= "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBQvPxhYmISs1nE8Qfc9GsNITiBka1RustOQ&usqp=CAU" alt='card image cap' class='card-image-top md-3 rounded-lg'/>`
    }
    <strong class="text-sm text-muted">Created on ${date.toDateString()}</strong>
    <h2 class="my-3">${title}</h2>
    <p class='lead'>${description}</p>
    </div>`;
};

// Here we'll be updating our local storage(i.e., the cards which we see on our UI)
const updateLocalStorage= () => {
    localStorage.setItem("task", JSON.stringify({
        tasks: state.taskList,
    })
  );
};

//Reverse process to get data/cards/modals on our UI from Local/Browser storage
const loadInitialData= () => {
    const localStorageCopy= JSON.parse(localStorage.task);

    if(localStorageCopy) state.taskList= localStorageCopy.tasks;
    state.taskList.map((cardData) => {
        taskContent.insertAdjacentHTML("beforeend", htmlTaskContent(cardData));
    });
};

// Event handler
const handleSubmit= (event) => {
  const id= `${Date.now()}`;
  const input= {
    url: document.getElementById("imageURL").value,
    title: document.getElementById("taskTitle").value,
    type: document.getElementById("tags").value,
    description: document.getElementById("taskDescription").value,
  };
  if(input.title=== "" || input.type=== "" || input.description=== ""){
    return alert("Please fill all the fields");
  }
  taskContent.insertAdjacentHTML("beforeend", htmlTaskContent({
    ...input, id, })
  );
  state.taskList.push({ ...input, id}); // updated taskList for 1st go
  updateLocalStorage(); // updated the same on local storage too
};

//Opens a new modal on our UIwhen user clicks open task
const openTask= (e) => {
  // pop up the current one
  if(!e) e = window.event;

  // find the correct card opened
  const getTask= state.taskList.find(({id})=> id=== e.target.id);
    taskModal.innerHTML= htmlModalContent(getTask); //We get 3rd card on clicking Open Task
};

//Delete operation
const deleteTask= (e) => {
  if(!e) e = window.event;

  const targetID= e.target.getAttribute("name");
  //console.log(targetID);

  const type= e.target.tagName;
  //console.log(type);

  const removeTask= state.taskList.filter(({id}) => id!== targetID);
  //console.log(removeTask);

  state.taskList= removeTask; // updating taskList
  updateLocalStorage(); // updating local storage

  if(type=== "button"){
    return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.parentNode.parentNode.parentNode
    );
  }
  return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
    e.target.parentNode.parentNode.parentNode.parentNode
  );
};