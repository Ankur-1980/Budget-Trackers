class UI {
	constructor() {
		this.budgetFeedback = document.querySelector('.budget-feedback');
		this.expenseFeedback = document.querySelector('.expense-feedback');
		this.budgetForm = document.getElementById('budget-form');
		this.budgetInput = document.getElementById('budget-input');
		this.budgetAmount = document.getElementById('budget-amount');
		this.expenseAmount = document.getElementById('expense-amount');
		this.balance = document.getElementById('balance');
		this.balanceAmount = document.getElementById('balance-amount');
		this.expenseForm = document.getElementById('expense-form');
		this.expenseInput = document.getElementById('expense-input');
		this.amountInput = document.getElementById('amount-input');
		this.expenseList = document.getElementById('expense-list');
		this.itemList = [];
		this.itemID = 0;
	}

	// submit budget
	submitBudgetForm() {
		// setting variable for the budget input
		const value = this.budgetInput.value;
		// creating an error message if the user doesn't input anything or enter a negative number
		if (value === '' || value < 0) {
			this.budgetFeedback.classList.toggle('showItem');
			this.budgetFeedback.innerHTML = `<p> value cannot be empty or negative </p>`;
			const self = this;
			// error message goes away after 3 secs
			setTimeout(function() {
				self.budgetFeedback.classList.toggle('showItem');
			}, 1000);
		} else {
			// putting the value from the input form into the budget heading
			this.budgetAmount.textContent = value;
			// clearing out the budget input
			this.budgetInput.value = '';
			this.showBalance();
		}
	}

	submitExpenseForm() {
		// setting variable for the expense description
		const expenseValue = this.expenseInput.value;
		const amountValue = this.amountInput.value;

		// creating error message if input fields are empty or negative
		if (expenseValue === '' || amountValue === '' || amountValue < 0) {
			this.expenseFeedback.classList.toggle('showItem');
			this.expenseFeedback.innerHTML = `<p> value cannot be empty or negative </p>`;
			`<p> value cannot be empty or negative </p>`;
			const self = this;
			// error message goes away after 3 secs
			setTimeout(function() {
				self.expenseFeedback.classList.toggle('showItem');
			}, 3000);
		} else {
			// changing the amountValue variable into a number
			let amount = parseInt(amountValue);
			// clearing out input fields
			this.expenseInput.value = '';
			this.amountInput.value = '';

			let expense = {
				id: this.itemID,
				title: expenseValue,
				amount: amount,
			};
			// incrementing the ID every time we add a new expense
			this.itemID++;
			// pushing expense into itemList array
			this.itemList.push(expense);
			// calling add expense method
			this.addExpense(expense);
			// show balance
			this.showBalance();
		}
	}

	// add expense
	addExpense(expense) {
		// create the div for the expense items
		const div = document.createElement('div');
		// add class of expense to newly created div
		div.classList.add('expense');
		// add HTML to the div that contains all information and icons for the expense
		div.innerHTML = `<div class="expense-item d-flex justify-content-between align-items-baseline">
    <h6 class="expense-title mb-0 text-uppercase list-item">- ${expense.title}</h6>
    <h5 class="expense-amount mb-0 list-item">$${expense.amount}</h5>

    <div class="expense-icons list-item">
      <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
        <i class="fas fa-edit"></i>
      </a>
      <a href="#" class="delete-icon" data-id="${expense.id}">
        <i class="fas fa-trash"></i>
      </a>
    </div>
  </div>`;
		this.expenseList.appendChild(div);
	}

	// show balance
	showBalance() {
		// setting a variable to after calling total expense function
		const expense = this.totalExpense();
		// formula for balance
		// taking the text content from budget amount and turning it into a number
		const total = parseInt(this.budgetAmount.textContent) - expense;
		// changing the display of the balance amount to the new total
		this.balanceAmount.textContent = total;
		if (total < 0) {
			this.balance.classList.remove('showGreen', 'showBlack');
			this.balance.classList.add('showRed');
		} else if (total > 0) {
			this.balance.classList.remove('showRed', 'showBlack');
			this.balance.classList.add('showGreen');
		} else if (total === 0) {
			this.balance.classList.remove('showGreen', 'showRed');
			this.balance.classList.add('showBlack');
		}
	}

	// total expense
	totalExpense() {
		let total = 0;
		if (this.itemList.length > 0) {
			total = this.itemList;
			total = this.itemList.reduce(function(acc, curr) {
				acc += curr.amount;
				return acc;
			}, 0);
		}
		this.expenseAmount.textContent = total;
		return total;
	}

	// edit an expense
	editExpense(element) {
		let id = parseInt(element.dataset.id);
		let parent = element.parentElement.parentElement.parentElement;
		// remove from DOM
		this.expenseList.removeChild(parent);
		// remove from the list
		let expense = this.itemList.filter(function(item) {
			return item.id === id;
		});
		// show value in form
		this.expenseInput.value = expense[0].title;
		this.amountInput.value = expense[0].amount;

		// remove from the list
		let tempList = this.itemList.filter(function(item) {
			return item.id !== id;
		});
		this.itemList = tempList;
		this.showBalance();
	}

	// delete an expense
	deleteExpense(element) {
		let id = parseInt(element.dataset.id);
		let parent = element.parentElement.parentElement.parentElement;
		// remove from DOM
		this.expenseList.removeChild(parent);
		// remove from the list
		let tempList = this.itemList.filter(function(item) {
			return item.id !== id;
		});
		this.itemList = tempList;
		this.showBalance();
	}
}

// one function for all event listeners
function eventListeners() {
	// accessing the main components immediately
	const budgetForm = document.querySelector('#budget-form');
	const expenseForm = document.querySelector('#expense-form');
	const expenseList = document.querySelector('#expense-list');

	// new instance of UI Class
	const ui = new UI();

	// budget form submit
	budgetForm.addEventListener('submit', function(event) {
		event.preventDefault();
		ui.submitBudgetForm();
	});

	// expense form submit
	expenseForm.addEventListener('submit', function(event) {
		event.preventDefault();
		ui.submitExpenseForm();
	});

	// expense list click
	expenseList.addEventListener('click', function(event) {
		if (event.target.parentElement.classList.contains('edit-icon')) {
			ui.editExpense(event.target.parentElement);
		} else if (event.target.parentElement.classList.contains('delete-icon')) {
			ui.deleteExpense(event.target.parentElement);
		}
	});
}

document.addEventListener('DOMContentLoaded', eventListeners);
