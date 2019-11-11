function checkFields() {
	var letters = document.querySelector('#avail_letters').value;
	var pattern = document.querySelector('#pattern_letters').value;
	var word_length = document.querySelector('#num_letters').value;
	var isvalid = true;

	if (letters.length == 0 && pattern.length == 0) {
		alert("Must either fill Letters or Pattern field.");
		isvalid = false;
	} else if (pattern.length > 0 && word_length != "Default") {
		if (word_length != pattern.length) {
			alert("Word length must match Pattern length.")
			isvalid = false;
		}
	}

	return isvalid;
}

document.getElementById('avail_letters').oninput = function() {
	var letters_error = document.querySelector('#letters_error');
	var letters = document.querySelector('#avail_letters').value;
	var letters_regex = /^[A-Za-z]+$/;

	if (letters.match(letters_regex) == null) {
		letters_error.style.display = "block";
		return false;
	} else {
		letters_error.style.display = "none";
	}

	return true;

}

document.getElementById('pattern_letters').oninput = function() {
	var pattern_error = document.querySelector('#pattern_error');
	var pattern = document.querySelector('#pattern_letters').value;
	var pattern_regex = /^[A-Za-z_.-]+$/;

	if (pattern.match(pattern_regex) == null) {
		pattern_error.style.display = "block";
		return false;
	} else {
		pattern_error.style.display = "none";
	}

	return true;
}


function postWord(word) {
	console.log(word);
	console.log(word.innerHTML);
	fetch(`/proxy/${word.innerHTML}`)
	.then(function(response) {
     	return response.json();
  })
  	.then(function(json) {
  		console.log('Request successful', json);
  		callbackFunc(json);
  })
  	.catch(function(error) {
    	console.log('Request failed', error)
  });
}

function callbackFunc(json) {

	$('.modal-title').empty();
	$('.modal-body').empty();
	if (typeof json[0].hwi === "undefined") {
		$('.modal-title').append('Word not found.')
	} else {
		$('.modal-title').append(`${json[0].hwi.hw} definition`);
	}

	for (var i = 0; i < json.length; i++) {
		var $defin = $('<div>', { 'class': 'sub-definition' });
		$($defin).append(`${i+1}: ${json[i].shortdef[0]}`);
		$('.modal-body').append($defin);
	}
}
