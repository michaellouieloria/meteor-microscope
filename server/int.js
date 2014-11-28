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
  saveFile: function(blob, name, path, encoding) {
    console.log('sdsd');
    check(blob, Match.Any);
    check(name, String);
    check(path, String);
    check(encoding, String);

    var path = cleanPath(path),
      name = cleanName(name || 'file'), encoding = encoding || 'binary',
      chroot = Meteor.chroot || (process.env.PWD + '/.uploads/images');
    // Clean up the path. Remove any initial and final '/' -we prefix them-,
    // any sort of attempt to go to the parent directory '..' and any empty directories in
    // between '/////' - which may happen after removing '..'
    path = chroot + (path ? '/' + path + '/' : '/');

    // TODO Add file existance checks, etc...
    fs.writeFile(path + name, blob, encoding, function(err) {
      if (err) {
        throw (new Meteor.Error(500, 'Failed to save file.', err));
      } else {
        console.log('The file ' + name + ' (' + encoding + ') was saved to ' + path);
      }
    });

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
