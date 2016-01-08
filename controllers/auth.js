//var domain = '';
var domain = 'http://localhost';
//var domain = 'http://angu-poxstone.c9users.io';

module.exports = {

  'facebookAuth' : {
    'clientID'      : '915763385159550', // your App ID
    'clientSecret'  : '673ce4b297aa123579978d492d6a3618', // your App Secret
    'callbackURL'   : domain+'/auth/facebook/callback'
  },

  'twitterAuth' : {
    'consumerKey'   : 'v9h8pwtCuROBTlZZU8eR3Jxd0',
    'consumerSecret': 'BhdTiABcS1EIjNlchKyvNJunJdopTkjyJykdLXvIEDhSlMc8aH',
    'callbackURL'   : domain+'/auth/twitter/callback'
  },

  'googleAuth' : {
    'clientID'      : '546344726865-uhepg7nl75dr0qpj8dodn7bvtdek2rpb.apps.googleusercontent.com',
    'clientSecret'  : 'WhcQ5np2xbfwAr2HszwSXWY3',
    'callbackURL'   : domain+'/auth/google/callback'
  }

};