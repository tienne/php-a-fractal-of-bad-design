const async = require('async'),
    ejs = require('ejs'),
    fs = require('fs'),
    path = require('path'),
    marked = require('marked');

const config = {
    src: path.join(__dirname, 'src'),
    dist: path.join(__dirname, 'docs')
};

const readFile = function (fileName) {
  return function (callback) {
    fs.readFile(path.join(config.src, fileName), 'utf-8', callback);
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
    fs.writeFile(path.join(config.dist, 'index.html'), builtText, function (err) {
      if (err) throw err;

      console.log("Finished.");
    });
  });
});

