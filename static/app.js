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
	var $modalfade = $('<div>', { 'class': 'modal fade', 'id': 'modalCenter', 'tabindex': "-1", 'role': 'dialog', 'aria-lebelledby': 'modalCenterTitle', 'aria-hidden': 'true'});
	var $modaldialog = $('<div>', { 'class': 'modal-dialog modal-dialog-centered', 'role': 'document' });
	var $modalcontent = $('<div>', { 'class': 'modal-content' });

	var $modalheader = $('<div>', { 'class': 'modal-header' });
	var $modaltitle = $('<h5>', { 'class': 'modal-title' });
	$($modaltitle).append(`${json[0].hwi.hw} definition`);
	var $closemodal = $('<button>', { 'type': 'button', 'class': 'close', 'data-dismiss': 'modal', 'aria-label': 'Close'});
	var $span = $('<span>', { 'aria-hidden': 'true' });
	$($span).append('&times;');
	$($modalheader).append($modaltitle);
	$($modalheader).append($closemodal);
	$($closemodal).append($span);

	var $modalbody = $('<div>', { 'class': 'modal-body' });
	for (var i = 0; i < json.length; i++) {
		var $defin = $('<div>', { 'class': 'sub-definition' });
		$($defin).append(`${i+1}: ${json[i].shortdef[0]}`);
		$($modalbody).append($defin);
	}

	var $modalfooter = $('<div>', { 'class': 'modal-footer' });
	var $closebutton = $('<button>', { 'type': 'button', 'class': 'btn btn-secondary', 'data-dismiss': 'modal'});
	$($closebutton).append('Close');

	$($modalcontent).append($modalheader);
	$($modalcontent).append($modalbody);
	$($modalcontent).append($modalfooter);

	$('#definition').append($modalcontent);
}
