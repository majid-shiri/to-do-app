
// Introduce the variable
let color='';
let headerJob = document.querySelector('input#headerJob')
let contentJob = document.querySelector('textarea#contentJob')
let addTrigger = document.getElementById('addBtn')
let toastNotification = document.getElementById('toast')
const taskList = document.querySelector('ul#tasklist')
const ul = document.querySelector('ul#colorTask')
const hideCheckBox = document.querySelector('input#hide')
const taskComplete = document.querySelectorAll('input .do')
const inputSearch = document.querySelector('input#search-item');



// Choosing the color of the works
ul.addEventListener('click',function(e) {
  let childs=e.target.parentNode.children;
  if(e.target.classList[0] === 'list-inline-item'){
    color= e.target.dataset.color;
     if(e.target.classList[2]!=='active'){
      Array.from(childs).forEach(el => {
        if(el.classList[2] ==='active'){
          el.classList.remove('active');
          e.target.classList.add('active');
        }else{
          e.target.classList.add('active');
        }
      });
     }
  }
})



//Loading data from local database
document.addEventListener('DOMContentLoaded',e =>{
  let obj={}
  obj=localStorage.getItem('tasks')
  let notification = document.createElement("div");
  notification.classList.add("alert", "alert-danger");
  if (obj !== null) {
   data=JSON.parse(obj)
  Object.keys(data).forEach(key => {
      let lis=document.createElement('li')
      let div=document.createElement('div');
      div.classList.add('callout',`callout-${data[key].color}`,'form-check','form-check-reverse')
      let checkBox=document.createElement('input')
      checkBox.classList.add('form-check-input')
      checkBox.type='checkbox'
      checkBox.checked=data[key].do
      if(checkBox.checked=data[key].do){
        div.classList.add('text-decoration-line-through')
      }
      let deleteItem=document.createElement('a')
      deleteItem.classList.add('btn','fa','fa-trash','deleteItem')
      let header=document.createElement('label')
      header.classList.add('form-check-label','headerjobs')
      header.innerHTML += data[key].header
      let content=document.createElement('p')
      content.classList.add('contentjobs')
      content.innerHTML += data[key].content
      div.append(checkBox,deleteItem,header,content)
      lis.appendChild(div)
      taskList.appendChild(lis)

  });  
  } else {
    notification.innerHTML += "empty list";
    taskList.appendChild(notification);
  }
})





//Add a new task to the list
if (addTrigger) {
  addTrigger.addEventListener('click', function () {
    headerNotifi=toastNotification.children[0].children[2]
    contentNotifi=toastNotification.children[1]
    if (headerJob.value && color && contentJob.value) {
      if(taskList.children[0].className ==="alert alert-danger"){
        taskList.children[0].remove();
      }
      let lis=document.createElement('li')
      let div=document.createElement('div');
      div.classList.add('callout',`callout-${color}`,'form-check','form-check-reverse')
      let checkBox=document.createElement('input')
      checkBox.classList.add('form-check-input')
      checkBox.type='checkbox'
      let deleteItem=document.createElement('a')
      deleteItem.classList.add('btn','fa','fa-trash','deleteItem')
      let header=document.createElement('label')
      header.classList.add('form-check-label','headerjobs')
      header.innerHTML += headerJob.value
      let content=document.createElement('p')
      content.classList.add('contentjobs')
      content.innerHTML += contentJob.value
      div.append(checkBox,deleteItem,header,content)
      lis.appendChild(div)
      taskList.appendChild(lis)
      var addData={
        header: headerJob.value,
        content: contentJob.value,
        color: color,
        do:false
      }
      storeToLocalStorage(addData);
      headerNotifi.innerHTML ='Successful'
      contentNotifi.innerHTML ='Your work has been added to the list.'
      clearInputs()
    }else{
      headerNotifi.innerHTML ='Error'
      contentNotifi.innerHTML ='Please Fill Forms'
    }
    let toast = new bootstrap.Toast(toastNotification)
      toast.show()
  })
}

//Data storage in local database
function storeToLocalStorage(data) {
  let count
  let obj=localStorage.getItem('tasks')
  let storeData={}
  if (obj === null) {
    storeData[0]=data;
    localStorage.setItem('tasks',JSON.stringify(storeData));
  }else{
    obj=JSON.parse(obj);
    count=Object.keys(obj).length;
    storeData=obj
    storeData[count]=data;
    localStorage.setItem('tasks',JSON.stringify(storeData));
  }
}


//Hide task list
hideCheckBox.addEventListener('change',e =>{
  if(hideCheckBox.checked === true){
    taskList.style.display = 'none';
  } else {
    taskList.style.display = 'block';
  }
})


//checked the completed tasks
taskList.addEventListener('change',e =>{
  let taskListChild=taskList.children
  let  datalist=localStorage.getItem('tasks')
  datalist =JSON.parse(datalist)
   if (e.target.checked) {
    Object.keys(taskListChild).forEach(key =>{
      if(taskListChild[key]===e.target.parentElement.parentElement){
        datalist[key].do=true
       e.target.parentNode.classList.add('text-decoration-line-through');
      }
    }) 
   }else{
    Object.keys(taskListChild).forEach(key =>{
      if(taskListChild[key]===e.target.parentElement.parentElement){
        datalist[key].do=false
       e.target.parentNode.classList.remove('text-decoration-line-through');
      }
    }) 
   }
   localStorage.setItem('tasks',JSON.stringify(datalist));
})



//The event of removing the task from the list
taskList.addEventListener('click',e =>{
   if (e.target.classList[3] ==='deleteItem') {
    e.target.parentElement.parentElement.remove();
    removeToLocalStoerage(e.target.parentElement.parentElement)
   }
})

//Event function to remove the task from the list
function removeToLocalStoerage(task) {
  let taskListChilds=taskList.children
  let  dataForRemove=localStorage.getItem('tasks')
  let  newData={}
  if (taskListChilds !== null) {
    dataForRemove =JSON.parse(dataForRemove)
    let i=0
    Object.keys(taskListChilds).forEach(key => {
      if(taskListChilds[key]!==task){
          newData[i]=dataForRemove[key]   
          i++   
      }
    })
    if (Object.keys(newData).length === 0) {
      let notification = document.createElement("div");
      notification.classList.add("alert", "alert-danger");
      localStorage.clear()
      notification.innerHTML += "empty list";
      taskList.appendChild(notification);
    }else{
      localStorage.setItem('tasks', JSON.stringify(newData));
    }

  }
}


//search data in search input  from task list
inputSearch.addEventListener('keyup', function(e){
  for(let book of taskList.children){
      if(book.firstElementChild.textContent.indexOf(inputSearch.value) !==-1){
          book.style.display = 'block';
      } else {
          book.style.display = 'none';
      }
  }
})

//clear inputs  after submit
function clearInputs(){
  headerJob.value= ""
  contentJob.value= ""
  color=""
  let childrens=ul.children;
  Array.from(childrens).forEach(el => {
    if(el.classList[2] ==='active'){
      el.classList.remove('active');
    }
  });
}