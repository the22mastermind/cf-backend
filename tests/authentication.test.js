import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';
import statusCodes from '../src/utils/statusCodes';
import messages from '../src/utils/messages';
import sample from './samples/authentication';

const {
  badRequest,
  conflict,
  created,
} = statusCodes;
const baseUrl = '/auth';

chai.use(chaiHttp);
chai.should();

let userToken = null;

describe('USER SIGN UP', () => {
  it('Empty First Name should return 400', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/signup`)
      .send(sample.emptySignupFirstName)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.emptySignupFirstName);
        done();
      });
  });
  it('Invalid First Name should return 400', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/signup`)
      .send(sample.invalidSignupFirstName)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.invalidSignupFirstName);
        done();
      });
  });
  it('Invalid Last Name should return 400', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/signup`)
      .send(sample.invalidSignupLastName)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.invalidSignupLastName);
        done();
      });
  });
  it('Invalid Email should return 400', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/signup`)
      .send(sample.invalidSignupEmail)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.invalidSignupEmail);
        done();
      });
  });
  it('Invalid Phone Number should return 400', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/signup`)
      .send(sample.invalidSignupPhone)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.invalidSignupPhone);
        done();
      });
  });
  it('Valid Signup should return 201', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/signup`)
      .send(sample.validSignup)
      .end((err, res) => {
        if (err) done(err);
        const { message, token } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(message).to.equal(messages.validSignup);
        expect(token);
        userToken = token;
        expect(userToken).to.be.a('string');
        done();
      });
  });
  it('Signing up existing user should return 409', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/signup`)
      .send(sample.validSignup)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(conflict);
        expect(error);
        expect(error).to.equal(messages.signupConflict);
        done();
      });
  });
  it('Signing up as an admin should return 400', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/signup`)
      .send(sample.adminSignup)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.adminSignup);
        done();
      });
  });
});
