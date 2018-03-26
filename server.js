const // Modules
	express = require('express'),
	http = require('http'),
	https = require('https')

const // Ports
	port = process.env.PORT || 8080,
	sslPort = 8443

const urlStore = []

const app = express()

// Routes
app.get('/:url', (req, res) => {
	const index = urlStore
		.map(x => x.short_url)
		.indexOf(`http://localhost:8080/${req.params.url}`)

	index === -1
		? res.send('URL Not Found.')
		: res.redirect(urlStore[index]['original_url'])
})

app.get('/new/*', (req, res) => {
	if (!/(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/.test(req.params[0])) {
		return res.json({success: false, msg: 'Invalid URL.'})
	}

	const urlObject = {
		original_url: req.params[0],
		short_url: `http://localhost:8080/${urlStore.length}`
	}

	urlStore.push(urlObject)
	res.json(urlObject)
})

http // Start HTTP server
	.createServer(app)
	.listen(port, () => console.log('HTTP listening on port', port))

/*
https // Start HTTPS server
	.createServer(options, app)
	.listen(sslPort);
*/
