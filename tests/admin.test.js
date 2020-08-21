import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';
import statusCodes from '../src/utils/statusCodes';
import messages from '../src/utils/messages';
import sample from './samples/admin';

const {
  badRequest,
  conflict,
  created,
  success,
  forbidden,
} = statusCodes;
const baseUrl = '/admin';

chai.use(chaiHttp);
chai.should();

let userToken = null;

describe('ADMIN ADD VENDOR', () => {
  it('Empty First Name should return 400', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/vendor`)
      .send(sample.emptyVendorFirstName)
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
      .post(`${baseUrl}/vendor`)
      .send(sample.invalidVendorFirstName)
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
      .post(`${baseUrl}/vendor`)
      .send(sample.invalidVendorLastName)
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
      .post(`${baseUrl}/vendor`)
      .send(sample.invalidVendorEmail)
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
      .post(`${baseUrl}/vendor`)
      .send(sample.invalidVendorPhone)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.invalidSignupPhone);
        done();
      });
  });
  it('Login user should return 200', (done) => {
    chai
      .request(server)
      .post('/auth/login')
      .send(sample.userNotAdmin)
      .end((err, res) => {
        if (err) done(err);
        const { token } = res.body;
        expect(res.status).to.equal(success);
        expect(token);
        userToken = token;
        expect(userToken).to.be.a('string');
        done();
      });
  });
  it('User not an admin should return 403', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/vendor`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(sample.validVendor)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(forbidden);
        expect(error);
        expect(error).to.equal(messages.adminOnlyResource);
        done();
      });
  });
  it('Login admin should return 200', (done) => {
    chai
      .request(server)
      .post('/auth/login')
      .send(sample.adminCredentials)
      .end((err, res) => {
        if (err) done(err);
        const { token } = res.body;
        expect(res.status).to.equal(success);
        expect(token);
        userToken = token;
        expect(userToken).to.be.a('string');
        done();
      });
  });
  it('Valid Vendor should return 201', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/vendor`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(sample.validVendor)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(message).to.equal(messages.adminVendorAddSuccess);
        expect(data);
        expect(data).to.haveOwnProperty('id');
        expect(data).to.haveOwnProperty('userId');
        expect(data).to.haveOwnProperty('status');
        done();
      });
  });
  it('Adding existing vendor (user) should return 409', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/vendor`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(sample.validVendor)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(conflict);
        expect(error);
        expect(error).to.equal(messages.signupConflict);
        done();
      });
  });
  it('Adding existing vendor (tin) should return 409', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/vendor`)
      .send(sample.duplicateTin)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(conflict);
        expect(error);
        expect(error).to.equal(messages.adminVendorAddDuplicate);
        done();
      });
  });
  it('Valid Vendor without TIN should return 201', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/vendor`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(sample.validVendorNoTin)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(message).to.equal(messages.adminVendorAddSuccess);
        expect(data);
        expect(data).to.haveOwnProperty('id');
        expect(data).to.haveOwnProperty('userId');
        expect(data).to.haveOwnProperty('status');
        done();
      });
  });
});
