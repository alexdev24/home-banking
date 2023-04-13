
const form = document.querySelector('#form');
const moneyInput = document.querySelector('#taskInput');
const contributionsList = document.querySelector('#contributionsList');
const formSpendings = document.querySelector('.spendings');
const formArchive = document.querySelector('#archive')
// const saveBtn = document.querySelector('#save');
const applyBtn = document.querySelector('#apply');
const spendingsСategory = document.querySelector('#spendingsNew');
const showArchiveBtn = document.querySelector('#btnArchive');

const puncts = document.querySelector('#str');
const addCat = document.querySelector('#add_category');



let total = 0;
let num = 0;
let fieldIndex = 0;

//Массивы для архива
let itog = [[],[],[],[],[],[],[],[],[],[],[],[]];
let fields = [[],[],[],[],[],[],[],[],[],[],[],[]];
// let itog = [];

//События
form.addEventListener('submit',doContribute);
applyBtn.addEventListener('click',applyCalculateForm);
showArchiveBtn.addEventListener('click', showArchive);
// formSpendings.addEventListener('submit',applyCalculateForm);
formSpendings.addEventListener('submit',saveForm);
addCat.addEventListener('click', addExpenseCategory);
spendingsСategory.addEventListener('click', interactionCategory);


//Функции

function interactionCategory(event){
    event.preventDefault();
    if(event.target.dataset.action === 'add'){
        fieldIndex++;
        const parentNode = event.target.closest('div');
        const listHtml = `
                <div class="list-group-item d-flex justify-content-between task-item">						
                    <label for="expense1">Название расхода:</label>
                    <input type="text" id="expense${fieldIndex}-name" name="expense_Name" placeholder="Укажите название">
                    <label for="expense2">Сумма расхода:</label>
                    <input type="number" id="expense${fieldIndex}-value" name="expense_Value" placeholder="Укажите сумму"><br><br>
                    <button type="button" data-action="delete" class="btn-action">
                            <img src="./img/cross.svg" alt="Done" width="18" height="18">
                    </button>
                </div>	
                `

    parentNode.insertAdjacentHTML('beforebegin' , listHtml);
    }
    
    else if(event.target.dataset.action === 'delete-category'){
       const parentNode = event.target.closest('li');
       parentNode.remove();
    }
    else if(event.target.dataset.action === 'delete'){
        const parentNode = event.target.closest('div');
        parentNode.remove();
     }
     
}

function doContribute(event){
    event.preventDefault();

    const contributeBtn = document.querySelector('#contribute');
    const moneyText = moneyInput.value;
    const magnit = moneyText * 0.10;
    const charity = moneyText * 0.05;
    const result = moneyText - (magnit + charity);

    const moneyHTML = ` <div id="contributionsList">
                          <div>Отложите:</div>
                          <div class="list-group-item d-flex justify-content-between ">
                            <span>На финансовый магнит(10%):</span><br>
                            <div class>${magnit}</div>
                          </div>
                          <div class="list-group-item d-flex justify-content-between ">
                              <span> На благотворительность(5%):</span><br>
                              <div class>${charity}</div>
                          </div>
                          <div class="list-group-item d-flex justify-content-between ">
                              <span class="totalSum">Сумма доступная для использования:</span><br>
                              <div class>${result}</div>
                          </div>    
                        </div>`

    contributionsList.insertAdjacentHTML('afterbegin', moneyHTML);
    contributeBtn.setAttribute('disabled', ' ');
}

function addExpenseCategory(event){
    num++;
    event.preventDefault();
    const catHtml = `
                <li>
                    <label>Категория:</label>
                    <input type="text" id="category${num}_name" placeholder="Укажите название" категории>
                    <button type="button" data-action="delete-category" class="btn-action">
                        <img src="./img/cross.svg" alt="Done" width="18" height="18">
                    </button>
                    <div class="punct" id="punct">							
                                            
                        <button alt="Add" data-action="add" class ="one" id = "addNew" type="click">
                            <img src="./img/pngwing.com.png"  width="18" height="18">Добавить новый расход
                        </button>
                    </div>												
                </li>	`

    spendingsСategory.insertAdjacentHTML('beforeend', catHtml);

}

function applyCalculateForm(event){
    event.preventDefault();
    const spendingsForm = document.forms.main;
    const inputs = spendingsForm.expense_Value;
    total += Number(inputs.value);
    const applyBtn = document.querySelector('#apply');

	for (let i = 0; i < inputs.length; i++) {
		total += Number(inputs[i].value);
	}

    let resultItog = moneyInput.value - total;
	  document.getElementById("total").textContent = `Всего расходов: ${total}`;
    document.getElementById("itog").textContent = `Итого в остатке: ${resultItog}`;
    applyBtn.setAttribute('disabled', ' ');
}

function saveForm(event){
  event.preventDefault();
    let date = document.querySelector('#date-change').value;
      
       let actualDate = new Date(date);
       let month = actualDate.getMonth();
       let year = actualDate.getFullYear();
       let valueWage = moneyInput.value;
       const archive = JSON.parse(localStorage.getItem("archiveTotal")) || {}; 
       const archiveExpense = JSON.parse(localStorage.getItem("archiveExpense")) || {}; 
       

      if (!archive[year]) {
        archive[year] = {};
      }

      if (!archive[year][month]) {
        archive[year][month] = [];
      }
      archive[year][month].push({valueWage,total});

      if (!archiveExpense[year]) {
        archiveExpense[year] = {};
      }

      if (!archiveExpense[year][month]) {
        archiveExpense[year][month] = [];
      }
      

    for (let i = 1; i <= fieldIndex; i++) {
        let name = document.getElementById(`expense${i}-name`).value;
        let value = document.getElementById(`expense${i}-value`).value;

        archiveExpense[year][month].push({name,value});     
  }
  localStorage.setItem("archiveTotal", JSON.stringify(archive));
  localStorage.setItem("archiveExpense", JSON.stringify(archiveExpense));

  contributionsList.innerHTML = "";
  spendingsСategory.innerHTML = "";
  document.getElementById("total").remove();
  document.getElementById("itog").remove();
}


function showArchive(event){
  event.preventDefault();
  ////////////////
  let date = document.getElementById("date").value;
  let archives = formArchive;
  archives.innerHTML = "";
  let month = new Date(date).getMonth();
  let year = new Date(date).getFullYear();
  const archive = JSON.parse(localStorage.getItem("archiveTotal")) || {}; 
  const archiveExpense = JSON.parse(localStorage.getItem("archiveExpense")) || {}; 
      
  const dataOne = archive[year]?.[month] || [];
  const dataTwo = archiveExpense[year]?.[month] || [];

  dataOne.forEach((item)=>{
    let field = document.createElement("div");
        field.innerHTML = `
          <label>Доход за месяц:</label>
          <input type="text" value="${item.valueWage}">
          <label>Общая сумма расходов за месяц:</label>
          <input type="number" value="${item.total}"><br>     
          <br>
        `;
        archives.appendChild(field);
  });

  dataTwo.forEach((item)=>{
    let field = document.createElement("div");
        field.innerHTML = `
          <label>Название расхода:</label>
          <input type="text" value="${item.name}">
          <label>Сумма расхода:</label>
          <input type="number" value="${item.value}"><br>     
          <br>
        `;
        archives.appendChild(field);
  });
    
}

function saveToLocalStorage(){
    localStorage.setItem('file', JSON.stringify(fields));
    localStorage.setItem('fileItog', JSON.stringify(itog));
}