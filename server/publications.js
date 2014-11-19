Meteor.publish('posts', function(author) {
  return Posts.find({});
});
