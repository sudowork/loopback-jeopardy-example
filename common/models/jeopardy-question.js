'use strict';

module.exports = function(Jeopardyquestion) {
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
  Jeopardyquestion.random = (callback) => {
    Jeopardyquestion.getDataSource().connector.connect((err, db) => {
      const collection = db.collection('jeopardy');
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
};
