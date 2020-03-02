const Joi = require('joi');
const jwt = require('jsonwebtoken');
const express = require('express');
const config = require('config');
const mysql = require('mysql');
const router = express.Router();

// db connection 
const dbhost = config.get('dbconfig.host');
const dbName = config.get('dbconfig.dbName');
const dbUsername = config.get('dbconfig.dbUsername');
const dbPassword = config.get('dbconfig.dbPassword');

const mysqlconn = mysql.createConnection({
  host: dbhost,
  user: dbUsername,
  password: dbPassword,
  database: dbName
})


router.get('/:room', async (req, res) => {
    
    let room = req.params.room;	
    
    mysqlconn.query("SELECT * FROM `chat_details` WHERE chat_room = '"+room+"'", function (err, results, fields) {
    if (err) throw err
        console.log(err);
        if(results == ''){
            res.status(400).send('-1');
        }else{
            res.status(200).send(results);
        }
    });

    
});

function validate(req) {
  const schema = {
    username: Joi.string().required(),
    password: Joi.string().required()
  };

  return Joi.validate(req, schema);
}

module.exports = router; 
