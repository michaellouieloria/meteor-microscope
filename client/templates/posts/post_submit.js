Template.postSubmit.events({
  'submit form': function(e, template) {
    e.preventDefault();
    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val(),
      image: 'sdsdsd'
    };


      var input = template.find('input[type=file]');
      var files = input.files;

console.log(files[0]);
Meteor.saveFile(files[0], 'lorz.jpg', '', 'binary');
    // _.each(e.srcElement.files, function(file) {
    //   console.log(file.name);
    //   Meteor.saveFile(file, file.name);
    // });

    Meteor.call('postInsert', post, function(error, result) {
    // display the error to the user and abort
      if (error)
        return alert(error.reason);

      if (result.postExists)
        alert('This link has already been posted');
        //Alerts.add('Database reading error!');

      //Router.go('postPage', {_id: result._id});

      Router.go('postsList');
    });
  }
});

Template.uploadInfo.helpers({
  files: function() {
    return Uploader.info.get();
  }
});

Meteor.saveFile = function(blob, name, path, type) {
  var fileReader = new FileReader(),
    method, encoding = 'binary', type = type || 'binary';
  switch (type) {
    case 'text':
      // TODO Is this needed? If we're uploading content from file, yes, but if it's from an input/textarea I think not...
      method = 'readAsText';
      encoding = 'utf8';
      break;
    case 'binary':
      method = 'readAsBinaryString';
      encoding = 'binary';
      break;
    default:
      method = 'readAsBinaryString';
      encoding = 'binary';
      break;
  }
  fileReader.onload = function(file) {
    Meteor.call('saveFile', file.srcElement.result, name, path, encoding, function(error, result) {});
  }
  fileReader[method](blob);
}
