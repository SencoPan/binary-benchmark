module.exports = ((packages, performance) => {
	const generated = require('./data/generated');

	const data = {
		internalData15kb: require('./data/15kb.json'),
		internalData35kb: require('./data/35kb.json'),
		generatedSmall  : generated.small,
		generatedLarge  : generated.large
	};

	const dataIndexes = Object.keys(data);
	const binInterfaceIndexes = Object.keys(packages);

	const iterations = 500;

	const processTiming = (cb, packageName, dataDesc, process) => {
		let res;
		const t0 = performance.now();

		for (let i = 0; i < iterations; i++) res = cb();
		const t1 = performance.now();

		const rawTime = t1 - t0;

		return {
			process,
			packageName,
			dataDesc,
			opPerSec: iterations / (rawTime / 1000),
			time    : `${rawTime} ms`
		};
	};

	const overallIteration = (func) => {
		const result = [];

		binInterfaceIndexes.forEach((packageName) => {
			const intermediateResult = {speedIndex: 0};

			dataIndexes.forEach((dataDesc) => {
				intermediateResult[dataDesc] = func(packageName, dataDesc);
				intermediateResult.speedIndex += intermediateResult[dataDesc].opPerSec;
			});

			intermediateResult.speedIndex = Math.round(intermediateResult.speedIndex);

			result.push(intermediateResult);
		});

		return result;
	};

	return {
		encode() {
			return overallIteration((packageName, dataDesc) => {
				console.log(packageName, 'started enc');
				return processTiming(() => packages[packageName].encode(data[dataDesc]), packageName, dataDesc, 'encode');
			});

			// Process of encoding;
		},
		decode() {
			return overallIteration((packageName, dataDesc) => {
				console.log(packageName, 'started dec');
				const encodedData = packages[packageName].encode(data[dataDesc]);
				if (!packages[packageName].decode(encodedData)) console.log(packageName, 'wrong decoding');
				return processTiming(() => packages[packageName].decode(encodedData), packageName, dataDesc, 'decode');
			});
			// Process of decoding;
		},
		dataIndexes,
		binInterfaceIndexes
	};
});

