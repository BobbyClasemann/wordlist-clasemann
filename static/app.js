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

function getWordData() {

	fetch('/proxy')
    .then(function (response) {
        return response.json(); // But parse it as JSON this time
    })
    .then(function (json) {
        console.log('GET response as JSON:');
        console.log(json); // Here’s our JSON object
    })
	/*$.ajax({
		type: "POST"
		url: "../app.py",
		data: { param: word },
		success: callbackFunc
	}).done(function(response) {
		$('#definition').empty();
		$('#definition').append(response.def);
	}); */
}

function postWord(word) {
	fetch('/proxy')
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
	for (var i = 0; i < json[0].shortdef.length; i++) {
		var $defin = $('<div>', { 'class': 'sub-definintion' });
		$($defin).append(`${i+1}: ${json[0].shortdef[i]}`);
		$('#definition').append($defin)
	}

}
