const msgpack = require('@msgpack/msgpack');
const coder = require('@niobium/coder');
const notepack = require('notepack');
const messagepack = require('messagepack');
const fbser = require('fast-bser/dist/v8-6.2/index');
const msgpackLite = require('msgpack-lite');

const benchConstruct = require('./index');

const fbserSerializer = new fbser.EncoderBE();
const fbserDecode = new fbser.DecoderBE()

const binInterface = {
	msgpack    : {
		encode: msgpack.encode,
		decode: msgpack.decode
	},
	coder      : {
		encode: (...args) => coder.serializer.encode(args),
		decode: (encodedData) => coder.serializer.decode(encodedData)
	},
	notepack   : {
		encode: notepack.encode,
		decode: notepack.decode
	},
	fbser      : {
		encode: (...args) => fbserSerializer.encode(args),
		decode: (encodedData) => fbserDecode.decode(encodedData)
	},
	msgpackLite: {
		encode: msgpackLite.encode,
		decode: msgpackLite.decode
	},
};

module.exports = benchConstruct(binInterface, performance)
