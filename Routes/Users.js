var express = require('express');
var users = express.Router();
var database = require('../Database/database');
var cors = require('cors')
var jwt = require('jsonwebtoken');
var token;

users.use(cors());

process.env.SECRET_KEY = "blooming";

users.post('/register', function(req, res) {

    var today = new Date();
    var appData = {
        "error": 1,
        "data": ""
    };
    var userData = {
        "firstname": req.body.firstname,
        "lastname": req.body.lastname,
        "email": req.body.email,
        "password": req.body.password,
        "type" : req.body.type,
        "created": today,
        "Address" : req.body.Address
    }
    console.log(userData);
    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            connection.query('INSERT INTO users SET ?', userData, function(err, rows, fields) {
                if (!err) {
                    appData.error = 0;
                    appData["data"] = "User registered successfully!";
                    res.status(201).json(appData);
                } else {
                    appData["data"] = "Error Occured!";
                    res.status(400).json(appData);
                }
            });
            connection.release();
        }
    });
});

users.post('/login', function(req, res) {

    var appData = {};
    var input = { 'email' : req.body.email, 'password' : req.body.password}

    console.log(input);

    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            console.log(err);
            res.status(200).json(appData);
        } else {
            connection.query('SELECT * FROM users WHERE email = ?', input.email, function(err, rows, fields) {
                if (err) {
                    appData.error = 1;
                    appData["data"] = "Error Occured!";
                    res.status(400).json(appData);
                } else {
                    
                    if (rows.length = 1) {
                        if (rows[0]){
                            console.log(rows);
                            if (rows[0].password == input.password) {
                                var data = JSON.stringify(rows[0]);
                                let token = jwt.sign({payload :{'firstname':rows[0].firstname,'lastname' : rows[0].lastname, 'address': rows[0].Address,'email': rows[0].email,'type':rows[0].type}}, process.env.SECRET_KEY, {
                                    expiresIn: 1440
                                });
                                appData.error = 0;
                                appData["token"] = token;
                                res.status(200).json(appData);
                            } else {
                                appData.error = 1;
                                appData["data"] = "Email and Password does not match";
                                res.status(200).json(appData);
                            }
                        }
                        else {
                            appData.error = 1;
                            appData["data"] = "Email and Password does not match";
                            res.status(200).json(appData);
                        }
                        
                    } else {
                        appData.error = 1;
                        appData["data"] = "Email does not exists!";
                        res.status(204).json(appData);
                    }
                }
            });
            connection.release();
        }
    });
});

users.use(function(req, res, next) {
    var token = req.body.token || req.headers['token'];
    var appData = {};
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, function(err) {
            if (err) {
                appData["error"] = 1;
                appData["data"] = "Token is invalid";
                res.status(500).json(appData);
            } else {
                next();
            }
        });
    } else {
        appData["error"] = 1;
        appData["data"] = "Please send a token";
        res.status(403).json(appData);
    }
});

users.get('/getUsers', function(req, res) {

    var appData = {};

    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            connection.query('SELECT *FROM users', function(err, rows, fields) {
                if (!err) {
                    appData["error"] = 0;
                    appData["data"] = rows;
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

module.exports = users;