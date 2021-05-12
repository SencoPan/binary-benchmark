import Vue from 'vue';
import App from './Benchmark';
import Vuetify from 'vuetify'

Vue.use(Vuetify)

const vuetify = new Vuetify({})

new Vue({
	vuetify,
	el    : '#app',
	render: h => h(App)
});

