from flask import Flask, request, Response
import requests
import itertools

app = Flask(__name__)

@app.route('/words/<string:letters>')
def letters_2_words(letters):
	with open('sowpods.txt') as f:
		good_words = set(x.strip().lower() for x in f.readlines())

	word_set = set()
	for l in rnage(3,len(letters)+1):
		for word in itertools.permutations(letters,l):
			w = "".join(word)
			if w in good_words:
				word_set.add(w)

	result = "<ol>"
	for w in word_set:
		result += f"<li>{w}</li>"

	result += "</ol>"

	return result

@app.route('/proxy')
def proxy():
	result = requests.get(request.args['url'])
	resp = Response(result.text)
	resp.headers['Content-Type'] = 'application/json'
	return resp

