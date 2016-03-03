module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'js/angular.js',
      '../node_modules/angular-route/angular-route.js',
      '../node_modules/angular-mocks/angular-mocks.js',
      'js/controllers.js',
      'js/consolaControllers.js',
      'test/pruebasJuegos.js',
      'test/pruebasConsolas.js',
      'test/pruebasConsola.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome', 'Firefox'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};