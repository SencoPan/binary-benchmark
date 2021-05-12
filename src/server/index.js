const express = require('express');
const path = require('path');
const fs = require('fs');
const server = express();

server.use('/', express.static(path.resolve('./dist')));

server.use(express.urlencoded({extended: false}));
server.use(express.json());

server.set('view engine', 'pug');

server.get('/', (req, res) => {
	res.sendFile(path.resolve('./dist/index.html'));
});
server.get('/test', (req, res) => {
	console.log(req)
})
server.post('/upload', (req, res) => {
	fs.writeFileSync(path.resolve(`./src/benchmark/result/browser/${req.body.mode}.json`), JSON.stringify(req.body?.json));
});

server.listen(5000, () => {
	console.log('Server started');
});
