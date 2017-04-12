const express = require('express')
const app = express()
const logger = require('morgan')
const bodyParser = require('body-parser')
var watson = require('watson-developer-cloud');
var path = require('path');

require('dotenv').config({path: 'watson.env'})

app.set('port', process.env.PORT || 3000)
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.locals.title = 'Info is Everywhere'

app.get('/', (request, response) => {
  response.render('index', {title: app.locals.title});
});

app.get('/tone-data', toneData)

app.post('/tone-data', (request, response) => {
  var text = request.body.text

  if (!text) {
  return response.status(422).send({
    error: 'No input property provided'
  })
} else {
  app.locals.text = text
  response.redirect('/tone-data')
  }});


// app.get('/api/v1/tone_data', toneData )


if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)
  })
}

var tone_analyzer = watson.tone_analyzer({
  username: process.env.WATSON_USERNAME,
  password: process.env.WATSON_PASSWORD,
  version: 'v3',
  version_date: '2016-05-19'
});

function toneData(request, response, next){
    tone_analyzer.tone({ text: app.locals.text},
                    function(err, tone){
                      if(err)
                        console.log(err.message);
                      else
                        var returnData = (tone);

                        var categories = returnData.document_tone.tone_categories

                        var emotional_data = returnData.document_tone.tone_categories[0]
                        var language_data = returnData.document_tone.tone_categories[1]
                        var social_data = returnData.document_tone.tone_categories[2]

                        response.render('data_show',{ emotional_data: emotional_data,
                                                      language_data: language_data,
                                                      social_data: social_data,
                                                      input_text: app.locals.text})
                        console.log(JSON.stringify(returnData, null, 4))
                    });
                  }
