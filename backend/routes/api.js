
'use strict';

var config = require('../config.js'),
    OpenTok = require('opentok');


module.exports = function(app) {

  var apiKey = config.opentok.apiKey,
      apiSecret = config.opentok.apiSecret,
      opentok = new OpenTok(apiKey, apiSecret);


// RECORD WITH SINGLE USER
  app.get('/video/single', function (req, res) {
    opentok.createSession({mediaMode:'routed'}, function(err, session) {
      if (err) res.json(err);
      var token = opentok.generateToken(session.sessionId, { role: 'moderator' });
      
      res.json({
        apiKey: apiKey,
        sessionId: session.sessionId,
        token: token
      });
    });
  });

  app.get('/video/single/start_recording', function(req, res) {

    var params = req.params,
        user = params.user,
        sessionId = params.sessionId,
        archiveName = params.archiveName;

    opentok.startArchive(sessionId, {
      user: user,
      name: archiveName,
    }, function(err, archive) {
      if(err) res.json({ error: err });
      res.json(archive);
    });
  });

  app.get('/video/single/stop_recording/:archiveId', function(req, res) {
    var archiveId = req.param('archiveId');

    opentok.stopArchive(archiveId, function(err, archive) {
      if (err) res.json({ error: err });
      res.json({text: 'Archive recording stopped'});
    });
  });

  app.get('/video/single/get/:archiveId', function(req, res) {
    var archiveId = req.param('archiveId');

    opentok.getArchive(archiveId, function(err, archive) {
      if (err) res.json({ error: err });
      res.json(archive);
    });
  });

  app.get('/video/single/delete/:archiveId', function(req, res) {
    var archiveId = req.param('archiveId');

    opentok.deleteArchive(archiveId, function(err) {
      if (err) res.json({ error: err });
      res.json({text: 'Archive deleted'});
    });
  });

  app.get('/video/single/history', function(req, res) {
    // var page = req.param('page') || 1,
        // offset = (page - 1) * 5;
    opentok.listArchives(function(err, archives, totalCount) {
      if (err) res.json({ error: err });
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
      if (err) res.json({ error: 'Could not get archive ' + archiveId + '. error='+err.message });
      res.json(archive.url);
    });
  });
};
