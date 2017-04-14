var secrets = require('react-native-config');

module.exports = {
  SESSION_TOKEN_KEY: secrets.SESSION_TOKEN_KEY || 'SESSION_TOKEN_KEY',
  backend: {
    hapiRemote: true,
    hapiLocal: false,
    parseRemote: false,
    parseLocal: false
  },
  HAPI: {
    local: {
      url: 'http://localhost:5000'
    },
    remote: {
      url: secrets.HAPI || 'https://snowflakeserver-bartonhammond.rhcloud.com/'
    }
  },
  PARSE: {
    appId: 'snowflake',                              // match APP_ID in parse-server's index.js
    local: {
      url: 'http://localhost:1337/parse'             // match SERVER_URL in parse-server's index.js
    },
    remote: {
      url: 'http://snowflake-parse.herokuapp.com/parse'   // match SERVER_URL in parse-server's index.js
    }
  },
  G_AUTO_API: secrets.G_AUTO_API,
  G_REVERSE_API: secrets.G_REVERSE_API
}
