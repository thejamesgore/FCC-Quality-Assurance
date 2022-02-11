const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let id1="";
let id2="";

suite('Functional Tests', function() {

     suite('POST /api/issues/{project}', () => {

    //Tests for POST request.........   
       test('Every field filled in', (done) => {
         chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: "Title",
            issue_text: "text",
            created_by: "creator",
            assigned_to: "assigned person",
            status_text: "active or inactive"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, "Title");
            assert.equal(res.body.issue_text, "text");
            assert.equal(res.body.created_by, "creator");
            assert.equal(res.body.assigned_to, "assigned person");
            assert.equal(res.body.status_text, "active or inactive");
            assert.equal(res.body.project, "test");
            id1 = res.body._id;
            console.log("id 1 has been set as " + id1)
            done();
          });
       });

       test('required fields filled in', (done) => {
         chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: "Title",
            issue_text: "text",
            created_by: "creator"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, "Title");
            assert.equal(res.body.issue_text, "text");
            assert.equal(res.body.created_by, "creator");
            assert.equal(res.body.assigned_to, "");
            assert.equal(res.body.status_text, "");
            assert.equal(res.body.project, "test");
            id2 = res.body._id;
            console.log("id 2 has been set as " + id2)
            done();
          });
       });

       test("missing required fields", (done) => {
         chai.request(server)
          .post("/api/issues/test")
          .send({
            issue_title: "title"
          })
          .end((err, res) => {
            assert.equal(res.body.error, "required field(s) missing");
            done();
          });
       });
     })

     //Tests for GET requests...............
     suite("GET /api/issues/{project}", () => {
        test("No filter", (done) => {
          chai.request(server)
           .get("/api/issues/test")
           .query({})
           .end((err, res) => {
             assert.equal(res.status, 200);
             assert.isArray(res.body);
             assert.property(res.body[0], "issue_title");
             assert.property(res.body[0], "issue_text");
             assert.property(res.body[0], "created_on");
             assert.property(res.body[0], "updated_on");
             assert.property(res.body[0], "created_by");
             assert.property(res.body[0], "assigned_to");
             assert.property(res.body[0], "open");
             assert.property(res.body[0], "status_text");
             assert.property(res.body[0], "_id");
             done();
           });
        });

        test("One filter", (done) => {
          chai.request(server)
          .get("/api/issues/test")
          .query({created_by: "creator"})
          .end((err, res) => {
            res.body.forEach((issueResult) => {
              assert.equal(issueResult.created_by, "creator"); 
            });     
            done();
          });
        });

        test("multiple filter", (done) => {
          chai.request(server)
          .get("/api/issues/test")
          .query({
            open: true,
            created_by: "creator"})
          .end((err, res) => {
            res.body.forEach((issueResult) => {
              assert.equal(issueResult.open, true);
              assert.equal(issueResult.created_by, "creator");
            })     
            done(); 
          });
        });
     })

     //Tests fo PUT requests.........
     suite("PUT /api/issues/{project}", () => {
        
        test("No body", (done) => {
          chai.request(server)
          .put("/api/issues/test")
          .send({})
          .end((err, res) => {
            assert.equal(res.body, "nothing changed");
            done();
          });
        });

        test("One field to update", (done) => {
          chai.request(server)
          .put("/api/issues/test")
          .send({
            _id: id1,
            issue_text: "new text"
          })
          .end((err, res) => {
            assert.notEqual(res.body.issue_text, "", "one field required");
            done();
          });
        });

        test("invalid id to update", (done) => {
          chai.request(server)
          .put("/api/issues/test")
          .send({
            _id: "some id"
          })
          .end((err, res) => {
            assert.notEqual(res.body._id, id1);
            done();
          });
        });

        test("missing id to update", (done) => {
          chai.request(server)
          .put("/api/issues/test")
          .send({
            _id: ""
          })
          .end((err, res) => {
            assert.equal(res.body.error, 'missing _id');
            done();
          });
        });

        test("multiple fields to update", (done) => {
          chai.request(server)
          .put("/api/issues/test")
          .send({
            _id: id1,
            issue_title: "new title",
            issue_text: "new text"
          })
          .end((err, res) => {
            assert.equal(res.body.result, "successfully updated");
            done();
          });
        });
     })

    //Tests for DELETE requests...............
    suite("DELETE /api/issues/{project}", () => {
       
       test("missing _id", (done) => {
          chai.request(server)
              .delete("/api/issues/test")
              .send({})
              .end((err, res) => {
                assert.equal(res.body.error, "missing _id");
                done();
              })
       });

       test("invalid _id", (done) => {
          chai.request(server)
              .delete("/api/issues/test")
              .send({
                _id: "some id"
              })
              .end((err, res) => {
                assert.notEqual(res.body._id, id1);
                done();
              })
       })     

       test("delete", (done) => {
          chai.request(server)
              .delete("/api/issues/test")
              .send({
                _id: id1
              })
              .end((err, res) => {
                assert.equal(res.body.result, "successfully deleted");
                done();
              })
       })     
    })
});
