// explanation
// var state ={
//     taskList:[
//       {
//         imageurl:"",
//         taskTitle:"",
//         taskType:"",
//         taskDescription:"",
//       },
//       {
//         imageurl:"",
//         taskTitle:"",
//         taskType:"",
//         taskDescription:"",
//       },
//       {
//         imageurl:"",
//         taskTitle:"",
//         taskType:"",
//         taskDescription:"",
//       },
//       {
//         imageurl:"",
//         taskTitle:"",
//         taskType:"",
//         taskDescription:"",
//       },
//       {
//         imageurl:"",
//         taskTitle:"",
//         taskType:"",
//         taskDescription:"",
//       },
//     ]
// };

//as we reload the page data is getting vanish  thats  why we use backup storage
//backup storage
const state = {
    taskList:[],
};
// dom operation
const taskContents =document.querySelector(".task_contents");
const taskModal =document.querySelector(".task_modal_body")
//console.log(taskContents);
//console.log(taskModal );


//template to display on screen
  //key=${id}. id is unique
const htmlTaskContent =({id,type,description ,title,url})=> `
    <div class="col-md-6 col-lg-4 mt-3" id=${id} key=${id}>
         <div class="card shadow-sm task_card ">
            <div class="card-header d-flex justify-content-end task_card_header gap-2">
                <button type="button" class="btn btn-outline-primary mr-1.5" name=${id} onclick="editTask.apply(this,arguments)" >
                    <i class="fa-solid fa-pencil  name=${id}" ></i>
                </button>
                <button type="button" class="btn btn-outline-danger " name=${id} onclick="deleteTask.apply(this,arguments)">   
                    <i class="fa-solid fa-trash  name=${id}" ></i>
                </button> 
            </div>
            <div class="card-body">
                ${
                    // url &&
                    // `<img width="100%" src=${url} alt='card image' class="card-img-top md-3 rounded-lg"/>`
                    url 
                    ? `<img width="100%" src=${url} alt='card image' class="img-fluid place_holder_image mb-3" />`
                    :`<img width="100%" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9cSGzVkaZvJD5722MU5A-JJt_T5JMZzotcw&s" alt='card image' class="img-fluid place_holder_image mb-3/>`
                 }
                
                <h4 class="card-title task_card_title">${title}</h4>
                <p class="description trim-3-lines text-muted">${description}</p>
                <div class="tag text-white d-flex flex-wrap">
                   <span class="badge bg-primary m-1">${type}</span>
                </div>
            </div>
            <div class="card-footer">
               <button type="button" class="btn btn-outline-primary float-right" data-bs-toggle="modal" data-bs-target="#showtask" onclick="openTask.apply(this,arguments)" id=${id}>open task</button>
            </div>                                                                              
         </div>
    </div>

`;
//modal body >>click of open task

const htmlModalContent =({id,description ,title,url})=> {
   const date =new Date(parseInt(id));
   return `
   <div id=${id}>
        ${
            url 
            ? `<img width="100%" src=${url} alt='card image' class="img-fluid place_holder_image mb-3" />`
            :`<img width="100%" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9cSGzVkaZvJD5722MU5A-JJt_T5JMZzotcw&s" alt='card image' class="img-fluid place_holder_image mb-3/>`
        };
        <strong class="text-muted text-sm">created on: ${date.toDateString()}</strong>
        <h2 class="my-3">${title}</h2>
        <p class="text-muted">${description}</p>

    </div>
   `;
}

//where we convert json > string (i.e. for local storage)
const updateLocalStorage = () => {
    localStorage.setItem(
       "tasky", 
       JSON.stringify({
        task :state.taskList,

       })
    );
};

//where we convert string >json (i.e. for for rendering the cards on the screen)
//load initial data
const loadInitialdata = () => {
    const localStorageCopy = JSON.parse(localStorage.tasky);

    if(localStorageCopy) state.taskList =localStorageCopy.task;                           //we are storing data in backup storage

    state.taskList.map((cardDate) => {
        taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate));          //cardDate is a id /our object
    });
};
/*
var date= new Date();
console,log(Date.now());
 */

//when we need to update or when we edit or we want to save
const handleSubmit = (event) => {
    // console.log("event trigger");
     const id =`${Date.now()}`;
     //getting the things from screen to the js file
     const input={
        url : document.getElementById("imageurl").value,
        title : document.getElementById("taskTitle").value,
        type : document.getElementById("tag").value,
        description : document.getElementById("taskDescription").value,
     };
     
     if (input.title==="" ||input.tag==="" ||input.description===""  ){
        return alert("please fill the necessary fields:-");
     } 
     taskContents.insertAdjacentHTML(
        "beforeend", 
        htmlTaskContent({...input,id})                    //display the particular updated card
     );   

     state.taskList.push({...input,id});                 //append the backup data. {...input,id} updated data push to the array taskList

     //push the data to the local storage
     updateLocalStorage();

};

//open Task
const openTask =(e) => {
  //  if(!e) e =window.event;  or  opentask.apply(this,arguments) line 78

    const getTask =state.taskList.find(({id}) => id === e.target.id);
    taskModal.innerHTML =htmlModalContent(getTask);

}

//delete Task
const deleteTask =(e) => {
      if(!e) e =window.event;  //(window.event)for deleting that exact card we want.we consider event is false and need to escalate from one window to another window
     
      const targetId = e.target.getAttribute("name");
      //console.log(targetId );                                          //you will get id
      const type=e.target.tagName;
      // console.log(type);                                              //show you that you were clicking on button or icon
      const removeTask =state.taskList.filter(({id}) => id!=targetId);
      //console.log(removeTask);
      updateLocalStorage();                                              //update local storage

//deleting the card from your screen
    if(type === "BUTTON"){
        console.log(e.target.parentNode.parentNode.parentNode.parentNode);
        return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
            e.target.parentNode.parentNode.parentNode
        );
    }else if(type === "I"){
         return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
             e.target.parentNode.parentNode.parentNode.parentNode
        );
    }
  };

  //edit Task
  const editTask =(e) => {
      if(!e) e = window.event;
      const targetId=e.target.id;
      const type=e.target.tagName;
      //creating the variable
      let parentNode;
      let taskTitle;
      let taskDescription;
      let taskType;
      
      if(type=== "BUTTON"){
        parentNode=e.target.parentNode.parentNode;
      }else {
        parentNode=e.target.parentNode.parentNode.parentNode;
      }

    //   taskTitle=parentNode.childNodes[3].childNodes[7].childNodes;
    //   console.log(taskTitle);
    
      taskType=parentNode.childNodes[3].childNodes[7].childNodes[1];                        //starting is from 3. 3-denotes the body
      taskDescription=parentNode.childNodes[3].childNodes[5];
      taskTitle=parentNode.childNodes[3].childNodes[3];
      SubmitButton=parentNode.childNodes[5].childNodes[1];

      //console.log(taskType,taskTitle,taskDescription,SubmitButton);

      taskTitle.setAttribute("contenteditable","true");                                     //title can be editable
      taskType.setAttribute("contenteditable","true");  
      taskDescription.setAttribute("contenteditable","true");                              

      SubmitButton.setAttribute("onclick","saveEdit.apply(this,arguments)");
      SubmitButton.removeAttribute("data-bs-toggle");
      SubmitButton.removeAttribute("data-bs-target");
      SubmitButton.innerHTML="Save Changes";                                               //innerHTML is for changing html part
  };

  //save Edit
   const saveEdit =(e) => {
    if(!e) e = window.event;

    const targetId=e.target.id;
    const parentNode=e.target.parentNode.parentNode;
    console.log(parentNode.childNodes);

    //wants this things to be trigger on your ui
   const  taskType=parentNode.childNodes[3].childNodes[7].childNodes[1];                        
   const  taskDescription=parentNode.childNodes[3].childNodes[5];
   const  taskTitle=parentNode.childNodes[3].childNodes[3];
   const  SubmitButton=parentNode.childNodes[5].childNodes[1];

    //update on your local storage
    const updateData = {
        taskTitle:taskTitle.innerHTML,
        taskType:taskType.innerHTML,
        taskDescription:taskDescription.innerHTML,
    };
    
    let stateCopy= state.taskList;
    stateCopy = stateCopy.map((task) => 
        task.id === targetId
        ? {
            id:task.id,
            title:updateData.taskTitle,
            description:updateData.taskDescription,
            type:updateData.taskType,
            url:task.url,
          }
        : task
     );
     state.taskList = stateCopy;
     updateLocalStorage();
     
     //make as non editable
     taskTitle.setAttribute("contenteditable","false");                                    
     taskType.setAttribute("contenteditable","false");  
     taskDescription.setAttribute("contenteditable","false");
     
     SubmitButton.setAttribute("onclick","openTask.apply(this,arguments)");              //submit button open to the open task
     SubmitButton.setAttribute("data-bs-toggle" ,"modal");
     SubmitButton.setAttribute("data-bs-target","#showtask");
     SubmitButton.innerHTML="open Task";   
  };

  //search
  const searchtask =(e) => {
    if(!e) e = window.event;

    while(taskContents.firstChild){                            //if we were search for firstchild it will show only firstchild & remove all the things
        taskContents.removeChild(taskContents.firstChild);
    }

    const resultData = state.taskList.filter(({title}) =>                               //check value include in your list 
        title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    console.log(resultData);
    resultData.map((cardData)=>                                                       //display only the card which have search 
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData))
   );

  };
