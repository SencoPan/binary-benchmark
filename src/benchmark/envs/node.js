const msgpack = require('@msgpack/msgpack');
const coder = require('@niobium/coder');
const codecs = require('codecs');
const tinyMsgpack = require('tiny-msgpack');
const notepack = require('notepack');
const messagepack = require('messagepack');
const msgpackLite = require('msgpack-lite');
const binTf = require('binarytf');
const binser = require('bser');
const {deserialize, serialize} = require('nason')

const {performance} = require('perf_hooks');

const benchConstruct = require('./index');

const codecsController = codecs('ndjson')

const connectPackage = (name, encode, decode) => {
	return {
		[name]: {
			decode,
			encode
		}
	};
};

const binInterface = {
	//...connectPackage('nason', serialize, deserialize), super slow only with json
	...connectPackage('coder', (...args) => coder.serializer.encode(args), (encoded) => coder.serializer.decode(encoded)),
	...connectPackage('tiny-msgpack', tinyMsgpack.encode, tinyMsgpack.decode),
	...connectPackage('codecs', codecsController.encode, codecsController.decode),
	//...connectPackage('binser', (...args) => binser.dumpToBuffer(args), (encoded) => binser.loadFromBuffer(encoded)), don't work with falsy values
	...connectPackage('msgpack', msgpack.encode, msgpack.decode),
	...connectPackage('notepack', notepack.encode, notepack.decode),
	//...connectPackage('messagepack', messagepack.encode, messagepack.decode), freezes
	...connectPackage('msgpackLite', msgpackLite.encode, msgpackLite.decode),
	...connectPackage('binTf', binTf.serialize, binTf.deserialize),
};

module.exports = benchConstruct(binInterface, performance);
