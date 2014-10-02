
'use strict';

var config = require('../config.js');


module.exports = function(app) {

  var OpenTok = require('opentok'),
      Emailer = require('../controllers/email/send-email.js');

	var	apiKey = config.opentok.apiKey,
      apiSecret = config.opentok.apiSecret;

  var opentok = new OpenTok(apiKey, apiSecret);

  opentok.createSession({mediaMode:'routed'}, function(err, session) {
    if (err) throw err;
    app.set('sessionId', session.sessionId);
  });

  app.get('/video/index', function(req, res) {

    // opentok.createSession({mediaMode:'routed'}, function(err, session) {
    //   if (err) throw err;
    //   app.set('sessionId', session.sessionId);
    // });

    var sessionId = app.get('sessionId'),
        token = opentok.generateToken(sessionId, { role: 'moderator' });

    res.json({
      apiKey: apiKey,
      sessionId: sessionId,
      token: token
    });
    // app.get('user')
    // if user do not have sessionId, attach generated sessionId to user
    // save sessionId for current user
  });

  // connect user to 'index' with sessionId
  app.get('/video/index/:sessionId', function(req, res) {

    opentok.createSession({mediaMode:'routed'}, function(err, session) {
      if (err) throw err;
      app.set('sessionId', session.sessionId);
    });

    var sessionId = req.params('sessionId'),
        // generate a fresh token for this client
        token = opentok.generateToken(sessionId, { role: 'subscriber' }); // publisher

    res.json({
      apiKey: apiKey,
      sessionId: sessionId,
      token: token
    });
  });

  app.get('/video/video-home', function(req, res) {

    var sessionId = req.params('sessionId'),
        // generate a fresh token for this client
        token = opentok.generateToken(sessionId, { role: 'subscriber' }); // publisher

    res.json({
      apiKey: apiKey,
      sessionId: sessionId,
      token: token
    });
  });

  // invite new person to video conference by sending email containing url/ + sessiondId
  app.get('/video/invite', function(req, res) {
    var emailer = new Emailer(req.query.email, req.user.name, req.query.sessionId);
    emailer.sendEmail();
  });

  app.get('/video/start', function(req, res) {
    opentok.startArchive(app.get('sessionId'), {
      name: req.query.name
    }, function(err, archive) {
      // if (err) return console.log(err);
      if(err) return res.json(err);
      res.json(archive);
    });
  });

  app.get('/video/stop/:archiveId', function(req, res) {
    var archiveId = req.param('archiveId');
    opentok.stopArchive(archiveId, function(err, archive) {
      if (err) return res.json(err);
      res.json({text: 'Archive recording stopped'});
    });
  });

  app.get('/video/get/:archiveId', function(req, res) {
    var archiveId = req.param('archiveId');
    opentok.getArchive(archiveId, function(err, archive) {
      if (err) return res.json(err);
      res.json(archive);
    });
  });

  app.get('/video/delete/:archiveId', function(req, res) {
    var archiveId = req.param('archiveId');
    opentok.deleteArchive(archiveId, function(err) {
      if (err) return res.json(err);
      res.json({text: 'Archive deleted'});
    });
  });

  app.get('/video/history', function(req, res) {
    // var page = req.param('page') || 1,
        // offset = (page - 1) * 5;
    opentok.listArchives(function(err, archives) {
      if (err) return res.json(err);
      res.json({
        archives: archives,
        // showPrevious: page > 1 ? ('/history?page='+(page-1)) : null,
        // showNext: (count > offset + 5) ? ('/history?page='+(page+1)) : null
      });
    });
  });

  app.get('/video/download/:archiveId', function(req, res) {
    var archiveId = req.param('archiveId');
    opentok.getArchive(archiveId, function(err, archive) {
      if (err) return res.send(500, 'Could not get archive '+archiveId+'. error='+err.message);
      res.json(archive.url);
    });
  });
};
