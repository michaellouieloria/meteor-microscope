Template.postSubmit.events({
  'submit form': function(e) {
    e.preventDefault();
    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val(),
      image: $(e.target).find('[name=image]').val()
    };

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
