var express = require('express');
var api = express.Router();
var database = require('../Database/database');
var cors = require('cors')
var jwt = require('jsonwebtoken');
var token;
const app = express();
const fileUpload = require('express-fileupload');

app.use(fileUpload());

app.post('/upload', function(req, res) {
    if (!req.files){
        console.log("ttt");
        return res.status(400).send('No files were uploaded.');

    }
      return res.status(400).send('No files were uploaded.');
   // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('/filename.jpg', function(err) {
      if (err){
          console.log(err);
          return res.status(500).send(err);
      }
      console.log("tes");  
      res.send('File uploaded!');
    });
  });

api.post('/getStudentData', function(req, res) {

    var studentID = req.body.studentId;
    var appData = {};
    database.connection.getConnection(function(err, connection) {

        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            connection.query('SELECT *FROM applicants where id = ?',studentID, function(err, rows, fields) {
                if (!err) {
                    appData["error"] = 0;
                    appData["data"] = rows[0];
                    console.log(appData);
                    res.status(200).json(appData);
                } else {
                    appData["data"] = "No data found";
                    res.status(204).json(appData);
                }
            });
            connection.release();
        }
    });
});

api.post('/newapplication', function(req, res) {

    var today = new Date();
    var appData = {
        "error": 1,
        "data": ""
    };
    var applicationData = {
        "child_first_name": req.body.child_first_name,
        "child_last_name": req.body.child_last_name,
        "address" : req.body.address,
        "city" : req.body.city,
        "year" : req.body.year,
        "birthday" : req.body.birthday,
        "parent_first_name": req.body.parent_first_name,
        "parent_last_name": req.body.parent_last_name,
        "email": req.body.email,
        "phn_num" : req.body.phn_num,
        "applied_at": today,
    }
    console.log(applicationData);
    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            connection.query('INSERT INTO applicants SET ?', applicationData, function(err, rows, fields) {
                if (!err) {
                    appData.error = 0;
                    appData["data"] = "User registered successfully!";
                    res.status(201).json(appData);
                } else {
                    appData["data"] = err;
                    res.status(400).json(appData);
                }
            });
            connection.release();
        }
    });
});

api.get('/getNotices', function(req, res) {

    var appData = {};
    database.connection.getConnection(function(err, connection) {

        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            connection.query('SELECT * FROM notices', function(err, rows, fields) {
                if (!err) {
                    appData["error"] = 0;
                    appData["data"] = rows;
                    console.log(appData);
                    res.status(200).json(appData);
                } else {
                    appData["data"] = "No data found";
                    res.status(204).json(appData);
                }
            });
            connection.release();
        }
    });
});

api.post('/newnotice', function(req, res) {

    var today = new Date();
    var appData = {
        "error": 1,
        "data": ""
    };
    console.log(today);
    var notice = {
        "title" : req.body.title,
        "description" : req.body.description,
        "expiredate" : today
    }

    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            connection.query('INSERT INTO notices SET ?', notice, function(err, rows, fields) {
                if (!err) {
                    appData.error = 0;
                    appData["data"] = "notice entered successfully!";
                    res.status(201).json(appData);
                } else {
                    appData["data"] = err;
                    res.status(400).json(appData);
                }
            });
            connection.release();
        }
    });
});

api.post('/newinquiry', function(req, res) {

    var today = new Date();
    var appData = {
        "error": 1,
        "data": ""
    };
    console.log(today);
    var inquiry = {
        "subject" : req.body.subject,
        "inquiry" : req.body.inquiry,
        "created" : today
    }

    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            connection.query('INSERT INTO inquiries SET ?', inquiry, function(err, rows, fields) {
                if (!err) {
                    appData.error = 0;
                    appData["data"] = "notice entered successfully!";
                    res.status(201).json(appData);
                } else {
                    appData["data"] = err;
                    res.status(400).json(appData);
                }
            });
            connection.release();
        }
    });
});

module.exports = api;