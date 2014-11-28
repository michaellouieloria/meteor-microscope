Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { return Meteor.subscribe('posts'); }
});

Router.route('/', {
  name: 'postsList',
  onAfterAction: function() {
    if (!Meteor.isClient) {
      return;
    }
    SEO.set({
      title: 'Home',
      meta: {
        'description': 'Home Description'
      },
      og: {
        'title': 'Home',
        'description': 'Home Description'
      }
    });
  }
});
Router.route('/posts/:slug', {
  name: 'postPage',
  data: function() {
    var post;
    post = Posts.findOne({
      slug: this.params.slug
    });
    //post = Posts.findOne(this.params._id);
    return post;
  },
  onAfterAction: function() {
    var post;
    if (!Meteor.isClient) {
      return;
    }
    post = this.data();
    SEO.set({
      title: post.title,
      meta: {
        'description': post.url
      },
      og: {
        'title': post.title,
        'description': post.url
      }
    });
  }
});
Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  data: function() { return Posts.findOne(this.params._id); }
});
Router.route('/submit', {name: 'postSubmit'});
Router.map(function() {
    this.route('serverFile', {
        where: 'server',
        path: /^\/images\/(.*)$/,
        action: function() {
          try {
             var filePath = process.env.PWD + '/.uploads/images/' + this.params[0];
             var data = fs.readFileSync(filePath);
             this.response.writeHead(200, {
                  'Content-Type': 'image'
             });
             this.response.write(data);
             this.response.end();
          }
          catch (e) {
            this.response.writeHead(500);
            this.response.end();
          }
        }
    });
});
var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction('dataNotFound', {only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});
