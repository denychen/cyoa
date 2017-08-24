module.exports = {
  'development': {
    'username': 'root',
    'password': process.env.MYSQL_PASSWORD,
    'database': 'development',
    'host': '127.0.0.1',
    'dialect': 'mysql'
  },
  'test': {
    'username': 'root',
    'password': process.env.MYSQL_PASSWORD,
    'database': 'test',
    'host': '127.0.0.1',
    'dialect': 'mysql'
  },
  'production': {
    'username': 'root',
    'password': process.env.MYSQL_PASSWORD,
    'database': 'production',
    'host': '127.0.0.1',
    'dialect': 'mysql'
  },
  'maxTitleLength': 70,
  'maxPremiseLength': 1000,
  'maxPageNameLength': 50,
  'maxPageContentLength': 3000,
  'maxPathCount': 3,
  'maxPathOptionLength': 30,
  'maxGenreCount': 3,
  'minimumPasswordLength': 8
}
