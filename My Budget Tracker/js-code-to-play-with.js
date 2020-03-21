const warning = () => {
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

	// warning if amount input is empty
	if (amountValue === '') {
		amountInput.classList.toggle('warning');
		amountInput.placeholder = 'Please enter an amount';
		// error message goes away after 3 secs
		setTimeout(function() {
			amountInput.classList.toggle('warning');
			amountInput.placeholder = 'Enter an amount';
		}, 3000);
	}
};
