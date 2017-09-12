'use strict';

module.exports = function(Jeopardyquestion) {
  const withCollection = (collectionName, method) => {
    return (callback) => {
      Jeopardyquestion.getDataSource().connector.connect((err, db) => {
        if (err) {
          return callback(err);
        }
        const collection = db.collection(collectionName);
        method(collection, callback);
      });
    };
  };
  const withJeopardy = (callback) => withCollection('jeopardy', callback);

  Jeopardyquestion.remoteMethod(
    'random',
    {
      http: {
        path: '/random',
        verb: 'get',
      },
      description: 'Gets one random question',
      returns: {
        arg: 'questions',
        type: 'json',
      },
    }
  );
  Jeopardyquestion.random = withJeopardy((collection, callback) => {
    collection.aggregate([
      {$sample: {size: 1}},
    ], (err, data) => {
      if (err) {
        return callback(err);
      }
      callback(null, data);
    });
  });
};
