
document.getElementById("editor_excersise_content").addEventListener("change", refreshPreview);
document.getElementById("editor_excersise_instruction").addEventListener("change", refreshPreview);
document.getElementById("refresh_preview_button").addEventListener("click", refreshPreview);
document.addEventListener('DOMContentLoaded', addEventListenersPreview);


function refreshPreview() {
	
	const editor_excersise_instruction =  document.getElementById("editor_excersise_instruction");
	const previewExcersiseInstruction = document.getElementById("excersise_preview_instruction");
	previewExcersiseInstruction.innerHTML = editor_excersise_instruction.value;
	
	clearEventListenersPreview();
	const editorExcersiseContentText = document.getElementById("editor_excersise_content");
	let cleanText = editorExcersiseContentText.value.replace( /(<([^>]+)>)/ig, '').trim();
	linesArray = cleanText.split(/\r?\n/);
	
	linesArray.forEach(function (line, i) {
		
		/* get rid of extra spaces */
		line = line.replace(/\s+/g, ' ').trim();
		/* get rid of extra pluses */
		line = line.replace(/\+\s+/g, ' '); /* if space after, delete */
		line = line.replace(/\+{2,}/gm, '+');
		line = line.replace(/\+\|/gm, '|'); /*get rid of + before |
		/* get rid of extra spaces again*/
		line = line.replace(/\s+/g, ' ').trim();
		
		/* clean bracket things */		
		line = removeUnmatchedBrackets(line);
		line = line.replace(/{ /g, '{');
		line = line.replace(/{/g, ' {');
		line = line.replace(/ }/g, '}');
		line = line.replace(/}/g, '} ');
		line = line.replace(/{(\S*)}/g, '$1');
		line = line.replace(/\s+/g, ' ');
		
		
		/* delete weird | */
		line = line.replace(/\|{2,}/gm, '|');
		line = line.replace(/^\|/gm, ' ');
		line = line.replace(/\s\|/gm, ' ');
		line = line.replace(/\|\s/gm, ' ');
		line = line.replace(/\|$/gm, '');
		
		
		/* remove | from between the brackets {} */
		while(new RegExp(/{[^}]*\|/gm).test(line)) {line = line.replace(/({[^}]*)\|/gm, '$1');}		
		/* remove + from between the brackets {} */
		while(new RegExp(/{[^}]*\+/gm).test(line)) {line = line.replace(/({[^}]*)\+/gm, '$1');}

		
		/* stick pluses to words/phrases */
		//line = line.replace(/\s\+/gm, '+');
		/*remove + from between the letters*/
		
		line = line.replace(/([^\s\|])\+(\S)/gm, '$1$2');

		/*remove + from end of line */
		line = line.replace(/\+$/gm, '');
		linesArray[i] = line;
		
    });
	
	cleanText = linesArray.join('\n');
	editorExcersiseContentText.value = cleanText;
	
	let content = "";
	
	linesArray.forEach(function(line) {
		content += "<p>";
		const wordsArray = line.split(" ");
		let phraseStarted = false;
		for (let i = 0; i < wordsArray.length; i++)
		{	
			let correctAnswer = (wordsArray[i].charAt(0) == '+');
			let extraclasses = "";
			
			if (correctAnswer) {
				wordsArray[i] = wordsArray[i].slice(1);
				extraclasses += " correct_answer";
			}
	
			if(phraseStarted) {
				phraseStarted = (wordsArray[i].slice(-1) != "}");
				wordsArray[i] = (!phraseStarted) ? (wordsArray[i].slice(0,-1) + "</span>") : wordsArray[i];
			}
			
			
			
			else if (wordsArray[i].charAt(0) == "{"){
				wordsArray[i] = ("<span name='excersise_content_word' class='excersise_content_word" + extraclasses + "'>" + wordsArray[i].slice(1));
				phraseStarted = true;
			}
			
			else {
				
				if (correctAnswer) wordsArray[i] = "+" + wordsArray[i];
				
				const wordPartsArray = wordsArray[i].split("|");
				wordPartsArray.forEach(function (part, i) {
					correctAnswer = (wordPartsArray[i].charAt(0) == '+');
					extraclasses = "";
					if (correctAnswer) {
						wordPartsArray[i] = wordPartsArray[i].slice(1);
						extraclasses += " correct_answer";
					}
					
					wordPartsArray[i] = "<span name='excersise_content_word' class='excersise_content_word" + extraclasses + "'>" + wordPartsArray[i] + "</span>";
					
				});
				wordsArray[i] = wordPartsArray.join("");
			}
		}
		content += wordsArray.join(" ");
		content += "</p>";
	});
	
	
	
	
	const editorExcersiseContentPreview = document.getElementById("excersise_content_preview_text");
	editorExcersiseContentPreview.innerHTML = content;
	addEventListenersPreview();

	
	
}

function removeUnmatchedBrackets(text) {	
	
	let openingsArray = [];
	let closingsArray = [];
	
	const regOpenings = /{/g;
	while ((match = regOpenings.exec(text)) != null) {
		openingsArray.push(match.index);
	}
	
	const regClosings = /}/g;
	while ((match = regClosings.exec(text)) != null) {
		closingsArray.push(match.index);
	}
	
	let openings_i = (openingsArray).length-1;
	let closings_i = (closingsArray).length-1;
	
	while (openings_i >= 0 && closings_i >= 0) {
		if (closingsArray[closings_i] < openingsArray[openings_i]){
			text = removeByIndex(text, openingsArray[openings_i]);
			//console.log("removing on: " + openingsArray[openings_i]);
			openings_i--;
		} 
		else {
			if(closings_i == 0 || openingsArray[openings_i] > closingsArray[closings_i-1]) {
				//console.log("proper pair: " + openingsArray[openings_i] + " " + closingsArray[closings_i]);
				closings_i--;
				openings_i--;
			}
			else {
				text = removeByIndex(text, closingsArray[closings_i]);
				//console.log("removing on: " + closingsArray[closings_i]);
				closings_i--;
			}
		}
	}
	
	if (openings_i == -1)
	{
		for (let i = closings_i; i >= 0; i--) text = removeByIndex(text, closingsArray[i]);
		return text;
	}
	
	if (closings_i == -1)
	{
		for (let i = openings_i; i >= 0; i--) text = removeByIndex(text, openingsArray[i]);
		return text;
	}
	
	return text;
}

function removeByIndex(str,index) {
      return str.slice(0,index) + str.slice(index+1);
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