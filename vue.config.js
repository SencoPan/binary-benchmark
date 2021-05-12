module.exports = {
	css                  : {
		extract: {ignoreOrder: true},
	},
	transpileDependencies: [
		'vuetify',
	],
	configureWebpack     : config => {
	},
	chainWebpack         : config => {
		config.module.rule('vue').use('vue-loader').loader('vue-loader')
		      .tap(options => {
			      options.whitespace = 'preserve';
			      return options;
		      });
	},
	pluginOptions        : {},
	assetsDir            : 'assets',
	runtimeCompiler      : true,
	productionSourceMap  : false,
	pages                : {
		'index': {
			entry   : './src/app/main.js',
			template: 'public/index.html',
			title   : 'Benchmark'
		}
	},
	lintOnSave           : false
};
