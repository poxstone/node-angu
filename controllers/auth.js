var dns = require('dns');
var os = require('os');
var hostname = os.hostname();
console.log("Short hostname = ", hostname);

dns.lookup(hostname, function (err, add, fam) {
  if (err){
    console.log("The error = ", JSON.stringify(err));
    return;
  }
  console.log('addr: '+add);
  console.log('family: ' + fam);
  dns.reverse(add, function(err, domains){
    if (err){
      console.log("The reverse lookup error = ", JSON.stringify(err));
      return;
    }
      console.log("The full domain name ", domains);
    }
  );
});

module.exports = {

  'facebookAuth' : {
    'clientID'      : '915763385159550', // your App ID
    'clientSecret'  : '673ce4b297aa123579978d492d6a3618', // your App Secret
    'callbackURL'   : '/auth/facebook/callback'
  },

  'twitterAuth' : {
    'consumerKey'   : 'v9h8pwtCuROBTlZZU8eR3Jxd0',
    'consumerSecret': 'BhdTiABcS1EIjNlchKyvNJunJdopTkjyJykdLXvIEDhSlMc8aH',
    'callbackURL'   : '/auth/twitter/callback'
  },

  'googleAuth' : {
    'clientID'      : '546344726865-uhepg7nl75dr0qpj8dodn7bvtdek2rpb.apps.googleusercontent.com',
    'clientSecret'  : 'WhcQ5np2xbfwAr2HszwSXWY3',
    'callbackURL'   : '/auth/google/callback'
  }

};