const // Modules
	express = require('express'),
	http = require('http'),
	https = require('https'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser')

const // Ports
	port = process.env.PORT || 8080,
	sslPort = 443


mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true})

const ShortURL = require('./models/ShortURL')

const app = express()

app.use('/public', express.static(process.cwd() + '/public'));

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Routes
app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/shorturl/:id', (req, res) => {
  const id = req.params.id
  
  if (!parseInt(id)) {
    return res.send({error: 'Invalid short URL.'})
  }
  
  const shortURL = parseInt(id)
  
  return ShortURL.findOne({shortURL})
    .exec()
    .then(doc => res.redirect(doc.originalURL))
    .catch(err => res.send({error: 'Short URL not found.'}))
})

app.post('/api/shorturl/new', (req, res) => {
  const originalURL = req.body.url
  
	if (!/(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/.test(originalURL)) {
		return res.send({success: false, msg: 'Invalid URL.'})
	}

	const shortUrl = new ShortURL({ originalURL })

	return shortUrl
    .save()
    .then(doc => doc.toObject())
    .then(({originalURL, shortURL}) => res.send({shortURL, originalURL}))
    .catch(err => res.send({error: 'Short URL creation failed.'}))
})

http // Start HTTP server
	.createServer(app)
	.listen(port, () => console.log('HTTP listening on port', port))

/*
https // Start HTTPS server
	.createServer(options, app)
	.listen(sslPort);
*/
