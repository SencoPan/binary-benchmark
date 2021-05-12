const TableConstructor = require('ascii-table');

const fs = require('fs');
const path = require('path');

const {iterate} = require('@niobium/tools');

const bench = require('./node');

const displayResult = (mode) => {
	const table = new TableConstructor();
	table.setHeading('', ...bench.dataIndexes, 'speedIndex');

	const result = bench[mode]();
	result.sort((a, b) => a.speedIndex > b.speedIndex ? 1 : -1);

	result.forEach(res => {
		const row = [];

		bench.dataIndexes.forEach(index => {
			row.push(`${Math.round(res[index].opPerSec)} ops/sec`);
		});

		row.push(res.speedIndex);

		table.addRow(res[bench.dataIndexes[0]].packageName, ...row);
	});

	console.log(table.toString());

	return result;
};


iterate(['encode', 'decode'], (v) => {
	const res = displayResult(v);
	fs.writeFileSync(path.resolve(`./result/node/${v}.json`), JSON.stringify(res));
});
