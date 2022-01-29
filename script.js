
document.getElementById("editor_excersise_content").addEventListener("change", refreshPreview);
document.getElementById("refreshPreviewButton").addEventListener("click", refreshPreview);


function refreshPreview() {
	clearEventListenersPreview();
	const editorExcersiseContentText = document.getElementById("editor_excersise_content");
	const cleanText = editorExcersiseContentText.value.replace( /(<([^>]+)>)/ig, '');
	editorExcersiseContentText.value = cleanText;
	const myArray = cleanText.split(" ");
	
	let content = "";
	myArray.forEach((element, index) => {
		content += ("<span name='excersise_content_word' class='excersise_content_word'>" + element + "</span>" + 
			(index != myArray.length ? " " : ""));
	});
	
	const editorExcersiseContentPreview = document.getElementById("editor_excersise_content_preview");
	editorExcersiseContentPreview.innerHTML = content;
	addEventListenersPreview();
	
	
}

function clearEventListenersPreview() {
	document.getElementsByName("excersise_content_word").forEach(element => element.removeEventListener("click", changeClass));
}

function addEventListenersPreview() {
	document.getElementsByName("excersise_content_word").forEach(element => element.addEventListener("click", changeClass.bind(event)));
}

function changeClass(element) {
	classList = element.srcElement.classList;
	classList.contains("checked_word") ? classList.remove("checked_word") :	classList.add("checked_word");
}


/*document.getElementById("form-bill").addEventListener("change", formatFormBill);

document.getElementsByName("select-tip-radio").forEach(element => element.addEventListener("focus", resetCustomTipValue));
document.getElementsByName("select-tip-radio").forEach(element => element.addEventListener("change", updateResult));

document.getElementById("tip-custom-input").addEventListener("focus", resetTipPercantageRadioGroup);
document.getElementById("tip-custom-input").addEventListener("change", updateResult);

document.getElementById("form-people").addEventListener("change", formatIntInput);


function updateResult() {
	if (document.getElementById("form-bill").value == "") {
		resetResults();
		return;
	}
	const billInputValue = document.getElementById("form-bill").value; 
	const tipPercentage = getTipPercentage();
	const noOfPeople = getNumberOfPeople();
	console.log(billInputValue, tipPercentage, noOfPeople);
	//ceil, so it adds up to full price (+ optional tip) or more (max $0.01 per person, but minimum full bill) //
	document.getElementById("total-per-person").innerHTML = '$' + (Math.ceil(billInputValue*(1 + tipPercentage/100)/noOfPeople*100)/100).toFixed(2);
	document.getElementById("tip-per-person").innerHTML = '$' + (Math.ceil(billInputValue*tipPercentage/noOfPeople)/100).toFixed(2);
	
	
}

function formatFormBill() {
	console.log("change");
	const billInput = document.getElementById("form-bill");
	// "" because of a browser bug, where you can type "10." or "e", but gives value "" 
	if (billInput.value == "" || billInput.value == NaN || billInput.value < 0) {billInput.value = 0;}
	billInput.value = (Math.floor(billInput.value * 100) / 100).toFixed(2);
	updateResult();
}

function getTipPercentage() {
	
	const customTipValue = document.getElementById("tip-custom-input").value;
	if (customTipValue != "") return customTipValue;
	
	const tipPercentageFromRadioGroup = document.querySelector('input[name="select-tip-radio"]:checked');
	if (tipPercentageFromRadioGroup === null) return 0;
	
	return tipPercentageFromRadioGroup.value;
}

//should I check for null if it's my code and not an argument?
function resetTipPercantageRadioGroup() {
	const tipPercentageFromRadioGroup = document.querySelector('input[name="select-tip-radio"]:checked');
	if (tipPercentageFromRadioGroup === null) return;
	tipPercentageFromRadioGroup.checked = false;		
}

function resetCustomTipValue() {
	customTipInput = document.getElementById("tip-custom-input").value = "";
}

function formatIntInput(evt) {
	const noOfPeopleInput = document.getElementById("form-people");
	// "" because of a browser bug, where you can type "10." or "e", but gives value "" 
	if (noOfPeopleInput.value == "" || noOfPeopleInput.value == NaN || noOfPeopleInput.value < 0) {noOfPeopleInput.value = 0;}
	noOfPeopleInput.value = Math.floor(noOfPeopleInput.value);
	updateResult();
}

function getNumberOfPeople() {
	const numberOfPeople = document.getElementById("form-people").value;
	if (numberOfPeople != "") return numberOfPeople;
	return 1;
}

function resetResults() {
	document.getElementById("tip-per-person").content = "$0.00";
	document.getElementById("total-per-person").content = "$0.00";
}

function resetForm() {
	
	resetResults();
	document.getElementById("form-bill").value = "";
	resetTipPercantageRadioGroup();
	resetCustomTipValue();
	document.getElementById("form-people").value = "";
}
*/
//validate input in custom tip and number of people numbers
//e and dot problem
//uncheck radio button