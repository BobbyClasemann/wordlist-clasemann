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
	$('#definition').empty();
	for (var i = 0; i < json.length; i++) {
		var $wordversion = $('<div>', { 'class': 'word-version' });
		for (var j = 0; j < json[i].shortdef.length; j++) {
			var $defin = $('<div>', { 'class': 'sub-definition' });
			$($defin).append(`${i+1}: ${json[i].shortdef[j]}`);
			$($wordversion).append($defin);
		}
		$('#definition').append($wordversion);
	}

}
