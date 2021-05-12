<template lang="pug">
	v-app: v-main.pa-4
		v-row: v-col.pb-0: p Результаты бенчмарка
		v-row: v-col.py-0: v-btn(@click="changeMode" color="primary")  Переключить результаты (на {{mode === 'browser' ? 'node' : 'browser'}})
		v-row
			v-col.col-10: v-data-table(:items="results.encode" :headers="header" disable-pagination hide-default-footer dense)
			v-col.col-2: v-btn(@click="launchProcess(1)" :loading="loading.encoding") Запустить encode
		v-row
			v-col.col-10: v-data-table(:items="results.decode" :headers="header" disable-pagination hide-default-footer dense)
			v-col.col-2: v-btn(@click="launchProcess(0)" :loading="loading.decoding") Запустить decode


</template>

<script>
import {serializer} from '@niobium/coder';
import notepack from 'notepack';
import msgpackLite from 'msgpack-lite';

const axios = require('axios');

const codecs = require('codecs');
const tinyMsgpack = require('tiny-msgpack');
const benchConstruct = require('../benchmark/');
const codecsController = codecs('ndjson')

const binInterface = {
	coder      : {
		encode: (...args) => serializer.encode(args),
		decode: (encodedData) => serializer.decode(encodedData)
	},
	notepack   : {
		encode: notepack.encode,
		decode: notepack.decode
	},
	msgpackLite: {
		encode: msgpackLite.encode,
		decode: msgpackLite.decode
	},
	tinyMsgpack: {
		encode: tinyMsgpack.encode,
		decode: tinyMsgpack.decode
	},
	codecs: {
		encode: codecsController.encode,
		decode: codecsController.decode
	},
};

const benchmark = benchConstruct(binInterface, performance);

const header = (text, value) => ({text, align: 'center', sortable: true, value});

export default {
	name: 'Benchmark',
	data() {
		return {
			benchmark,
			mode   : 'browser',
			loading: {
				encode: false,
				decode: false
			},
			results: {
				encode: [],
				decode: []
			},
			header : []
		};
	},
	methods: {
		makeHeader() {
			this.header.push(header('Название модуля', 'name'));
			this.header.push(header('Время internalData15kb', 'internalData15kb'));
			this.header.push(header('ОП/сек internalData15kb', 'internalData15kbOp'));
			this.header.push(header('Время internalData35kb', 'internalData35kb'));
			this.header.push(header('ОП/сек internalData35kb', 'internalData35kbOp'));
			this.header.push(header('Время generatedSmall', 'generatedSmall'));
			this.header.push(header('ОП/сек generatedSmall', 'generatedSmallOp'));
			this.header.push(header('Время generatedLarge', 'generatedLarge'));
			this.header.push(header('ОП/сек generatedLarge', 'generatedLargeOp'));
			this.header.push(header('Индекс скорости', 'speedIndex'));
		},

		makeRow(data) {
			const formedData = [];

			data.forEach(row => {
				const rowObj = {};

				benchmark.dataIndexes.forEach(index => {
					const [time, measurement] = row[index].time.split(' ')
					rowObj[index] = `${parseFloat(time).toFixed(2)} ${measurement}`;
					rowObj[`${index}Op`] = Math.round(row[index].opPerSec);
				});

				rowObj.name = row[benchmark.dataIndexes[0]].packageName;
				rowObj.speedIndex = row.speedIndex;

				formedData.push(rowObj);
			});

			return formedData;
		},
		changeMode() {
			this.mode = this.mode === 'browser' ? 'node' : 'browser';
			this.uploadResults();
		},
		uploadResults() {
			try {
				this.results.encode = this.makeRow(require(`../benchmark/result/${this.mode}/encode.json`));
				this.results.decode = this.makeRow(require(`../benchmark/result/${this.mode}/decode.json`));
			} catch (e) {
				//
			}
		},

		launchProcess(type) {
			const mode = type === 1 ? 'encode' : 'decode';
			const result = benchmark[mode]();

			axios.post('/upload', {json: result, mode});

			this.results[mode] = this.makeRow(result);
		}
	},
	created() {
		this.makeHeader();
		this.uploadResults();
	}
};
</script>

<style>

</style>
