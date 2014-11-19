Meteor.startup(function() {
 if(Meteor.isClient){
    return SEO.config({
      title: 'Default Title',
      meta: {
        'description': 'Default description'
      },
      og: {
        'image': 'http://mic.com/1.jpg'
      }
    });
  }
});
