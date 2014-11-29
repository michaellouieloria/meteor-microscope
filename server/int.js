Meteor.startup(function () {
  UploadServer.init({
    tmpDir: process.env.PWD + '/.uploads/tmp',
    uploadDir: process.env.PWD + '/.uploads',
    getDirectory: function(file, formData) {
      return formData.contentType;
    },
    getFileName: function(file, formData) {
      var trimmed = file.trim();
      slug = Random.id() + '-' + trimmed.replace(/[^a-z0-9-.]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

      return slug + file;
    },
    finished: function(file, folder, formFields) {
      console.log('Write to database: ' + folder + '/' + file);
      console.log(formFields);
    }
  });

  fs = Npm.require('fs');
});

Meteor.methods({
  saveFile: function(blob, name, original, thumb, encoding) {
    check(blob, Match.Any);
    check(name, String);
    check(original, String);
    check(thumb, String);
    check(encoding, String);

    var name = cleanName(name || 'file'), encoding = encoding || 'binary',
      chroot = Meteor.chroot || (process.env.PWD + '/.uploads/images');
    // Clean up the original. Remove any initial and final '/' -we prefix them-,
    // any sort of attempt to go to the parent directory '..' and any empty directories in
    // between '/////' - which may happen after removing '..'
    original = process.env.PWD + original
    thumb = process.env.PWD + thumb

    // TODO Add file existance checks, etc...
    fs.writeFile(original + name, blob, encoding, function(err) {
      if (err) {
        throw (new Meteor.Error(500, 'Failed to save file.', err));
      } else {
        console.log('The file ' + name + ' (' + encoding + ') was saved to ' + original);
      }
    });

    Imagemagick.resize({
      srcPath: original + name,
      dstPath: thumb + name,
      width: 100
    });

    //Imagemagick.convert([path + name, '-resize', '25x120', path + 'test.jpg']);

    function cleanPath(str) {
      if (str) {
        return str.replace(/\.\./g,'').replace(/\/+/g,'').
          replace(/^\/+/,'').replace(/\/+$/,'');
      }
    }
    function cleanName(str) {
      return str.replace(/\.\./g,'').replace(/\//g,'');
    }
  }
});

BrowserPolicy.content.allowInlineScripts();
BrowserPolicy.content.allowOriginForAll('*.disquscdn.com');
BrowserPolicy.content.allowOriginForAll('*.disqus.com');
BrowserPolicy.content.allowOriginForAll('*.google-analytics.com');
