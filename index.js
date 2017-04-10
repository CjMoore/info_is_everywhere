const express = require('express')
const app = express()
const logger = require('morgan')
const bodyParser = require('body-parser')
var watson = require('watson-developer-cloud');

require('dotenv').config({path: 'watson.env'})

app.set('port', process.env.PORT || 3000)

app.use(logger('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.locals.title = 'Watson Test'

app.get('/', (request, response) => {
  response.send(app.locals.title);
});

app.get('/api/v1/tone_data', toneData )


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
    tone_analyzer.tone({ text: "If I can stop one heart from breaking, I shall not live in vain; If I can ease one life from aching, or cool one pain, Or help one fainting robin unto his nest again, I shall not live in vain"},
                    function(err, tone){
                      if(err)
                        console.log(err);
                      else
                        response.send(JSON.stringify(tone, 3, 2));
                    });
                  }
