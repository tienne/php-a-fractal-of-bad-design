var async = require('async')
  , ejs = require('ejs')
  , fs = require('fs')
  , marked = require('marked');


var readFile = function (fileName) {
  return function (callback) {
    fs.readFile(__dirname + '/src/' + fileName, 'utf-8', callback);
  };
};

async.parallel({
  template: readFile('index.ejs'),
  text: readFile('text.md')
},
function (err, files) {
  if (err) throw err;

  marked(files.text, {
    gfm: true,
    highlight: function (code, lang, callback) {
      callback(null, code);
    },
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false,
    langPrefix: 'lang-'
  },
  function (err, content) {
    if (err) throw err;

    var builtText = ejs.render(files.template, {text: content});
    fs.writeFile(__dirname + '/index.html', builtText, function (err) {
      if (err) throw err;

      console.log("Finished.");
    });
  });
});

