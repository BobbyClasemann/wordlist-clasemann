from flask import Flask, request, Response, render_template
import requests
import itertools
from flask_wtf.csrf import CSRFProtect
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, SelectField, validators
import re
import json

class WordForm(FlaskForm):
	def validate_letters(form, field):
		if (len(field.data) == 0):
			raise ValidationError(message)

	avail_letters = StringField("Letters", validators=[validators.Regexp(r"[A-Za-z]", message="Must contain letters only."), validators.Optional()], render_kw={'class': 'form-control'})  #This is the label, validators like Required, optional, can make your own
	num_letters = SelectField('Length of words', choices=[("Default", "Select"), ("3","3"), ("4", "4"), ("5", "5"), ('6', "6"), ('7', "7"), ('8', "8"), ('9', "9"), ('10', "10")], render_kw={'class': 'form-control'})
	pattern_letters = StringField('Pattern', validators=[validators.Regexp(r"[A-Za-z_.-]", flags=0, message="Input must be letters or periods."), validators.Optional()], render_kw={'class': 'form-control'})
	submit = SubmitField("Submit")


csrf = CSRFProtect()
app = Flask(__name__)
app.config["SECRET_KEY"] = "row the boat"
csrf.init_app(app)

@app.route('/index')
def index():
	form = WordForm()
	return render_template("index.html", form=form)

@app.route('/words', methods=['POST', 'GET'])
def letters_2_words():

	form = WordForm()
	if form.validate_on_submit():
		letters = form.avail_letters.data.lower()
		wordLength = form.num_letters.data
		pattern = form.pattern_letters.data.lower()
	else:
		return render_template("index.html", form=form)
	with open('sowpods.txt') as f:
		good_words = set(x.strip().lower() for x in f.readlines())

	word_set = set()
	if (len(letters) > 0):
		if (wordLength == "Default"):
			for l in range(1, len(letters)+1):
				for word in itertools.permutations(letters,l):
					isMatch = True
					w = "".join(word)
					if (len(pattern) != 0):
						isMatch = (re.match(pattern, w) and len(w) == len(pattern))
					if w in good_words and isMatch:
						word_set.add(w)
		else:
			for word in itertools.permutations(letters, int(wordLength)):
				isMatch = True
				w = "".join(word)
				if (len(pattern) != 0):
					isMatch = (re.match(pattern, w) and len(w) == len(pattern))
				if w in good_words and isMatch:
					word_set.add(w)

	else:
		for word in itertools.product("abcdefghijklmnopqrstuvwxyz", repeat=len(pattern)):
			isMatch = True
			w = "".join(word)
			isMatch = re.match(pattern, w)
			if w in good_words and isMatch:
				word_set.add(w)


	word_set_alpha = sorted(word_set, key=str.lower)
	return render_template('wordlist.html',
		wordlist=sorted(word_set_alpha, key=len))

@app.route('/proxy/<word>')
def proxy(word):
	print(word)
	result = requests.get(f'https://dictionaryapi.com/api/v3/references/collegiate/json/{word}?key=d1055154-10f5-41ed-a300-beb207ed7018')
	resp = Response(result.text)
	print(resp)
	resp.headers['Content-Type'] = 'application/json'
	return resp

