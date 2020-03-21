// DOM Variables
// form variables
const descriptionInput = document.querySelector('#description-input');
const amountInput = document.querySelector('#amount-input');
const btn = document.querySelector('#btn');
const dropDown = document.querySelector('#categories-select');
const transactionForm = document.querySelector('#transaction-form');

// main total variables
const balance = document.querySelector('#balance');
const incomeTotal = document.querySelector('#income');
const expensesTotal = document.querySelector('#expenses');
const balanceText = document.querySelector('#balance-text');
const balanceP = document.querySelector('#balance-p');
const incomeText = document.querySelector('#income-text');
const expensesText = document.querySelector('#expenses-text');

// variables for the different lists
const historyList = document.querySelector('#history-list');
const categoryLists = document.getElementsByClassName('cat-list');
const entList = document.querySelector('#ent-list');
const incList = document.querySelector('#inc-list');
const foodList = document.querySelector('#food-list');
const clothingList = document.querySelector('#clothing-list');
const billsList = document.querySelector('#bills-list');

// category totals
const incTotal = document.querySelector('#inc-total');
const entTotal = document.querySelector('#ent-total');
const foodTotal = document.querySelector('#food-total');
const clothingTotal = document.querySelector('#clothing-total');
const billsTotal = document.querySelector('#bills-total');

let transactionID = 0;

// const dummyTransactions = [
// 	{ id: 1, desc: 'Flower', category: 'food', amount: -20 },
// 	{ id: 2, desc: 'Salary', category: 'income', amount: 300 },
// 	{ id: 3, desc: 'Book', category: 'clothing', amount: -10 },
// 	{ id: 4, desc: 'Camera', category: 'bills', amount: -150 },
// 	{ id: 5, desc: 'Movie', category: 'entertainment', amount: -50 },
// 	{ id: 6, desc: 'Freelance', category: 'income', amount: 150 },
// ];

// setting a variable
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

// looking in local storage for transactions
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// warning for if there is no money
function noMoney() {
	let x = parseInt(balanceText.innerText);
	if (x < 0) {
		alert(`no MONEY!!!`);
	}
}

// change the color of the balance
function balanceColorChange() {
	let x = parseInt(balanceText.innerText);
	if (x < 0) {
		balanceP.classList.remove('plus');
		balanceP.classList.add('minus');
	} else if (x > 0) {
		balanceP.classList.remove('minus');
		balanceP.classList.add('plus');
	} else if (x === 0) {
		balanceP.classList.remove('plus', 'minus');
	}
}

// add transactions to the array
function addTransaction(event) {
	// need to stop submit action from occurring
	event.preventDefault();

	//variables for description and amount inputs
	const descValue = descriptionInput.value.trim();
	const amountValue = amountInput.value.trim();
	// warning if description input is empty
	if (descValue === '') {
		descriptionInput.classList.toggle('warning');
		descriptionInput.placeholder = 'Please enter a description';
		// error message goes away after 3 secs
		setTimeout(function() {
			descriptionInput.classList.toggle('warning');
			descriptionInput.placeholder = 'Enter Description';
		}, 3000);
	}

	// we can only get the value after the function runs
	let dropDownValue = dropDown.options[dropDown.selectedIndex].value;

	// warning if amount input is empty
	if (amountValue === '') {
		amountInput.classList.toggle('warning');
		amountInput.placeholder = 'Please enter an amount';
		// error message goes away after 3 secs
		setTimeout(function() {
			amountInput.classList.toggle('warning');
			amountInput.placeholder = 'Enter an amount';
		}, 3000);
	} else {
		let transaction = {
			// create an ID to keep track of the objects
			id: transactionID,
			//
			desc: descValue,
			category: dropDownValue,
			// neat trick to turn a string into number
			amount: +amountValue,
		};

		// increase Transaction ID
		transactionID++;
		// push new transaction into transactions array

		transactions.push(transaction);
		// add transaction to DOM
		addTransactionDOM(transaction);
		// put transaction into appropriate category
		categorize(transaction);
		// update total of the category
		categoryTotals(transaction);
		// update main values
		updateValues();

		// add transaction to local storage
		updateLocalStorage();

		// clear inputs
		amountInput.value = '';
		descriptionInput.value = '';
		dropDown.selectedIndex = 0;
	}
}

// add transactions to DOM
function addTransactionDOM(transaction) {
	// get sign
	const sign = transaction.amount < 0 ? '-' : '+';

	// create new li element
	const item = document.createElement('li');

	// add class based on value
	item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

	// add innerHTML of item
	item.innerHTML = `
	<span class="list-desc">${transaction.desc}</span>
	<span class="list-amount">${sign}$${Math.abs(transaction.amount)}</span>
	<span class="list-cat">${transaction.category}</span>
	<button class='delete-btn' onclick='removeTransaction(${transaction.id})'>x</button>`;

	// add to DOM
	historyList.appendChild(item);
}

// update balance, income and expense
function updateValues() {
	// get amounts from array
	const amounts = transactions.map(transaction => transaction.amount);

	// // get sign
	// const sign = transaction.amount < 0 ? '-' : '+';

	// get balance by adding everything in the array
	const total = amounts.reduce((acc, curr) => (acc += curr), 0).toFixed(2);

	// get total income
	const income = amounts
		// filter out amounts over 0
		.filter(item => item > 0)
		// add the filtered amounts
		.reduce((acc, curr) => (acc += curr), 0)
		// make sure there are 2 decimal points
		.toFixed(2);

	// get total expenses
	const expenses = amounts
		.filter(item => item < 0)
		.reduce((acc, curr) => (acc += curr), 0)
		.toFixed(2);
	// add totals to the DOM
	balanceText.innerText = `${total}`;
	incomeText.innerText = `${income}`;
	expensesText.innerText = `${expenses}`;
	// no money
	noMoney();
	balanceColorChange();
}

// add transactions to categories
function categorize(transaction) {
	// get sign
	const sign = transaction.amount < 0 ? '-' : '+';

	// create li
	const item = document.createElement('li');

	// add innerHTML
	item.innerHTML = `${transaction.desc} 
    <span>${sign}$${Math.abs(transaction.amount)}
	</span> `;

	let categories = transaction.category;

	switch (categories) {
		case 'entertainment':
			entList.appendChild(item);
			break;
		case 'food':
			foodList.appendChild(item);
			break;
		case 'clothing':
			clothingList.appendChild(item);
			break;
		case 'bills':
			billsList.appendChild(item);
			break;
		case 'income':
			incList.appendChild(item);
			break;
		default:
			break;
	}
}

// category totals
function categoryTotals(transaction) {
	// create variable for categories
	let categories = transaction.category;

	// get sign
	const sign = transaction.amount < 0 ? '-' : '+';

	// filtering categories
	let tempCat = transactions.filter(function(cat) {
		return cat.category === categories;
	});

	// get only the amounts
	const amounts = tempCat.map(transaction => transaction.amount);

	// add the amounts
	const total = amounts.reduce((acc, curr) => ((acc += curr), 0).toFixed(2));

	switch (categories) {
		case 'entertainment':
			entTotal.innerText = `${sign}$${Math.abs(total)}`;
			break;
		case 'food':
			foodTotal.innerText = `${sign}$${Math.abs(total)}`;
			break;
		case 'clothing':
			clothingTotal.innerText = `${sign}$${Math.abs(total)}`;
			break;
		case 'bills':
			billsTotal.innerText = `${sign}$${Math.abs(total)}`;
			break;
		case 'income':
			incTotal.innerText = `${sign}$${Math.abs(total)}`;
			break;
		default:
			break;
	}
}

// remove transaction by id
function removeTransaction(id) {
	// filter the transactions array for everything BUT the ID we want to remove
	transactions = transactions.filter(transaction => transaction.id !== id);
	updateLocalStorage();
	initialize();
}

// update Local storage transactions
function updateLocalStorage() {
	localStorage.setItem('transactions', JSON.stringify(transactions));
}

// clear out stuff
function clearOut() {
	// clear out lists
	historyList.innerHTML = '';
	entList.innerHTML = '';
	foodList.innerHTML = '';
	incList.innerHTML = '';
	clothingList.innerHTML = '';
	billsList.innerHTML = '';
	// reset totals
	entTotal.innerText = `$0.00`;
	incTotal.innerText = `$0.00`;
	foodTotal.innerText = `$0.00`;
	clothingTotal.innerText = `$0.00`;
	billsTotal.innerText = `$0.00`;
}

// initialize App
function initialize() {
	clearOut();

	transactions.forEach(addTransactionDOM);
	transactions.forEach(categorize);
	transactions.forEach(categoryTotals);
	updateValues();
}

// function negative() {
// 	let dropDownValue = dropDown.options[dropDown.selectedIndex].value;
// 	// let radioValue = document.querySelector('input[name="inc-exp"]:checked').value;

// 	if (
// 		dropDownValue === 'entertainment' ||
// 		dropDownValue === 'food' ||
// 		dropDownValue === 'clothing' ||
// 		dropDownValue === 'bills'
// 	) {
// 		amountInput.value = '-';
// 	} else if (dropDownValue === 'income') {
// 		amountInput.value = '';
// 	}

// 	// alert(`working?`);
// }

initialize();

transactionForm.addEventListener('submit', addTransaction);
// dropDown.addEventListener('change', negative);
