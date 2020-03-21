// DOM variables
const balance = document.querySelector('#balance');
const money_plus = document.querySelector('#money-plus');
const money_minus = document.querySelector('#money-minus');
const list = document.querySelector('#list');
const form = document.querySelector('#form');
const text = document.querySelector('#text');
const amount = document.querySelector('#amount');
let transactions = [];
// const dummyTransactions = [
// 	{ id: 1, text: 'Flower', amount: -20 },
// 	{ id: 2, text: 'Salary', amount: 300 },
// 	{ id: 3, text: 'Book', amount: -10 },
// 	{ id: 4, text: 'Camera', amount: 150 },
// ];

// const dummyTransactions = [
// 	{ id: 1, desc: 'Flower', category: 'food', amount: -20 },
// 	{ id: 2, desc: 'Salary', category: 'income', amount: 300 },
// 	{ id: 3, desc: 'Book', category: 'clothing', amount: -10 },
// 	{ id: 4, desc: 'Camera', category: 'bills', amount: -150 },
// 	{ id: 5, desc: 'Movie', category: 'entertainment', amount: -50 },
// 	{ id: 6, desc: 'Freelance', category: 'income', amount: 150 },
// ];

// const transactions = dummyTransactions;

// local storage keeps everything in a stringified array
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

function addTransaction(e) {
	e.preventDefault();

	if (text.value.trim() === '' || amount.value.trim() === '') {
		alert('Please add a text and amount');
	} else {
		const transaction = {
			id: generateID(),
			text: text.value,
			amount: +amount.value,
		};

		// push to array
		transactions.push(transaction);

		addTransactionDOM(transaction);

		updateValues();

		updateLocalStorage();

		text.value = '';
		amount.value = '';
	}
}

// generate ID
function generateID() {
	return Math.floor(Math.random() * 1000000000);
}

// add transactions to DOM list
function addTransactionDOM(transaction) {
	// get sign
	const sign = transaction.amount < 0 ? '-' : '+';

	const item = document.createElement('li');

	// add class based on value
	item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

	item.innerHTML = `${transaction.desc} <span>${sign}${Math.abs(
		transaction.amount
	)}</span> <button class='delete-btn' onclick='removeTransaction(${transaction.id})'>x</button>`;

	list.appendChild(item);
}

// update the balance, income and expense
function updateValues() {
	const amounts = transactions.map(transaction => transaction.amount);

	const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

	const income = amounts
		.filter(item => item > 0)
		.reduce((acc, item) => (acc += item), 0)
		.toFixed(2);

	const expense = amounts
		.filter(item => item < 0)
		.reduce((acc, item) => (acc += item), 0)
		.toFixed(2);

	// insert into DOM
	balance.innerText = `$${total}`;
	money_plus.innerText = `$${income}`;
	money_minus.innerText = `$${expense}`;
}

// remove transaction by ID
function removeTransaction(id) {
	transactions = transactions.filter(transaction => transaction.id !== id);

	updateLocalStorage();

	init();
}

// update local storage transactions
// putting items into local storage
// needs to convert array into a string
function updateLocalStorage() {
	localStorage.setItem('transactions', JSON.stringify(transactions));
}

// initialize app
function init() {
	list.innerHTML = '';

	transactions.forEach(addTransactionDOM);
	updateValues();
}

init();

form.addEventListener('submit', addTransaction);
