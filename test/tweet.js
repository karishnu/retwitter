process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let tweet_server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

describe('/GET tweets feed', () => {
    it('it should GET all the tweets for a particular user', (done) => {
        chai.request(tweet_server)
            .get('/tweet/feed')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0d2VldHMiOltdLCJmb2xsb3dpbmciOltdLCJmb2xsb3dlcnMiOltdLCJfaWQiOiI1YmM0OGQxNjBhYjVmZTAzYzRmNWE4NGMiLCJ1c2VybmFtZSI6ImthcmlzaG51IiwiZW1haWwiOiJrYXJpc2hudUBnbWFpbC5jb20iLCJuYW1lIjoiS2FyaXNobnUgUG9kZGFyIiwicGFzc3dvcmQiOiIkMmEkMTAkd1drV3VBdGJJUjU2MDlzSmN2Y0xndW5obTdKUVhzc0ZSdi9HbG9nTC9DeUhkQS9ZZ2h3TjIiLCJsb2NhdGlvbiI6Ik11bWJhaSIsInRpbWVfc2lnbl91cCI6IjIwMTgtMTAtMTVUMTI6NTA6MzAuNzU3WiIsIl9fdiI6MCwiaWF0IjoxNTM5Njc3MjI1fQ.Isqlyi4DKrigSVjokcFqUpSPyDO2ZfxSDOi0v4aXoVM')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.be.a('array');
                done();
            });
    });
});

describe('/GET tweet', () => {
    it('it should GET a particular tweet', (done) => {
        chai.request(tweet_server)
            .get('/tweet')
            .query({_id: '5bc59c941e005d106a09501b'})
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0d2VldHMiOltdLCJmb2xsb3dpbmciOltdLCJmb2xsb3dlcnMiOltdLCJfaWQiOiI1YmM0OGQxNjBhYjVmZTAzYzRmNWE4NGMiLCJ1c2VybmFtZSI6ImthcmlzaG51IiwiZW1haWwiOiJrYXJpc2hudUBnbWFpbC5jb20iLCJuYW1lIjoiS2FyaXNobnUgUG9kZGFyIiwicGFzc3dvcmQiOiIkMmEkMTAkd1drV3VBdGJJUjU2MDlzSmN2Y0xndW5obTdKUVhzc0ZSdi9HbG9nTC9DeUhkQS9ZZ2h3TjIiLCJsb2NhdGlvbiI6Ik11bWJhaSIsInRpbWVfc2lnbl91cCI6IjIwMTgtMTAtMTVUMTI6NTA6MzAuNzU3WiIsIl9fdiI6MCwiaWF0IjoxNTM5Njc3MjI1fQ.Isqlyi4DKrigSVjokcFqUpSPyDO2ZfxSDOi0v4aXoVM')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.have.property('type');
                res.body.data.should.have.property('text');
                res.body.data.should.have.property('posted_by');
                done();
            });
    });
});