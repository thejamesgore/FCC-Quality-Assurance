'use strict';

const expect      = require('chai').expect;
let mongodb = require('mongodb');
const mongoose = require('mongoose');

module.exports = function (app) {

  //MongoDB connection.....
  let url = process.env.DB;
  mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log('connection successfull')).catch(err => console.log(err));

  //Schema......
  let issueSchema = new mongoose.Schema({
    "issue_title": {type: String, required: true},
    "issue_text": {type: String, required: true},
    "created_on": {type: Date, required: true},
    "updated_on": {type: Date, required: true},
    "created_by": {type: String, required: true},
    "assigned_to": String,
    "open": {type: Boolean, required: true},
    "status_text": String,
    "project": String
  });

  //Model.......
  let Issue = mongoose.model('Issue', issueSchema);

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      let fltrObj = Object.assign(req.body);
      fltrObj['project'] = project;
      Issue.find(fltrObj, (error, results) => {
        if(!error && results){
          return res.json(results);
        }
      })
    })
    
    .post(function (req, res){
      let project = req.params.project;
      if(!req.body.issue_title || !req.body.issue_text || !req.body.created_by){
        return res.json({error:'required field(s) missing'});
      }
          let newIssue = new Issue({
            "issue_title": req.body.issue_title,
            "issue_text": req.body.issue_text,
            "created_on": new Date().toUTCString(),
            "updated_on": new Date().toUTCString(),
            "created_by": req.body.created_by,
            "assigned_to": req.body.assigned_to || '',
            "open": true,
            "status_text": req.body.status_text || '',
            "project": project
          })
        newIssue.save((error, savedIssue) => {
            if (!error && savedIssue) {
              return res.json(savedIssue);
            } else {
              return res.json("Couldn't save");
            }
        })
    })
    
    .put(function (req, res){
      let project = req.params.project;
      let updateObj = {};
    
      if(req.body._id){
        Object.keys(req.body).forEach(key => {
          if(req.body[key] != ""){
            updateObj[key]=req.body[key];
          }
        })
      }
      if(!req.body._id){
        res.json({ error: 'missing _id' });
        return;
      }

       if(Object.keys(updateObj).length < 2){
         return res.json({ error: 'no update field(s) sent', '_id': req.body._id });
       }

       updateObj['updated_on'] = new Date().toUTCString();

       Issue.findByIdAndUpdate(req.body._id,updateObj,(error, updateIssue) => {  
            let _id = req.body._id;
            if(!error && updateIssue){
              res.json({ result: 'successfully updated', '_id': _id });
              return;
            }else if(!updateIssue){
              res.json({ error: 'could not update', '_id': _id });
              return;
            }
       })  
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      if(!req.body._id){
        return res.json({ error: 'missing _id' });
      }
      Issue.findByIdAndRemove(req.body._id,(error, deleteIssue) => {
        if(!error && deleteIssue) {
           return res.json({ result: 'successfully deleted', '_id': req.body._id });
        } else {
          return res.json({ error: 'could not delete', '_id': req.body._id });
        }
      })
    });
    
};
