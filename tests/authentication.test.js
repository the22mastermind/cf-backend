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
  success,
  unauthorized,
  notFound,
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

describe('USER UPDATE PROFILE', () => {
  it('Updating user profile without token should return 400', (done) => {
    chai
      .request(server)
      .patch(`${baseUrl}/profile`)
      .send(
        {
          address: sample.validUpdateBody.address,
        },
      )
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.absentToken);
        done();
      });
  });
  it('Updating user profile with invalid token should return 400', (done) => {
    chai
      .request(server)
      .patch(`${baseUrl}/profile`)
      .set('Authorization', `Bearer ${userToken}===`)
      .send(
        {
          address: sample.validUpdateBody.address,
        },
      )
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.invalidToken);
        done();
      });
  });
  it('Invalid Password should return 400', (done) => {
    chai
      .request(server)
      .patch(`${baseUrl}/profile`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(
        {
          password: sample.invalidUpdateBody.password,
        },
      )
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.invalidPassword);
        done();
      });
  });
  it('Invalid Address should return 400', (done) => {
    chai
      .request(server)
      .patch(`${baseUrl}/profile`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(
        {
          address: sample.invalidUpdateBody.address,
        },
      )
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.invalidAddress);
        done();
      });
  });
  it('Invalid update body should return 400', (done) => {
    chai
      .request(server)
      .patch(`${baseUrl}/profile`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(sample.emptyUpdateBody)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.invalidUpdateBody);
        done();
      });
  });
  it('Update of password for unverified user should return 401', (done) => {
    chai
      .request(server)
      .patch(`${baseUrl}/profile`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(
        {
          password: sample.validUpdateBody.password,
        },
      )
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(unauthorized);
        expect(error);
        expect(error).to.equal(messages.userNotVerified);
        done();
      });
  });
  it('Verify user should return 200', (done) => {
    chai
      .request(server)
      .patch(`${baseUrl}/profile`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ valid: 'true' })
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.validProfileUpdate);
        done();
      });
  });
  it('Valid update of password should return 200', (done) => {
    chai
      .request(server)
      .patch(`${baseUrl}/profile`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(
        {
          password: sample.validUpdateBody.password,
        },
      )
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.validProfileUpdate);
        expect(data);
        done();
      });
  });
  it('Valid update of address should return 200', (done) => {
    chai
      .request(server)
      .patch(`${baseUrl}/profile`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(
        {
          address: sample.validUpdateBody.address,
        },
      )
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.validProfileUpdate);
        expect(data);
        expect(data).to.haveOwnProperty('address');
        done();
      });
  });
  it('User profile setup complete should return 200', (done) => {
    chai
      .request(server)
      .patch(`${baseUrl}/profile`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ profileComplete: 'true' })
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.profileUpdateCompleted);
        done();
      });
  });
});

describe('USER LOGIN', () => {
  it('Empty Email/Password should return 400', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/login`)
      .send(sample.emptyLoginCredentials)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.emptyLoginCreds);
        done();
      });
  });
  it('Invalid Password should return 400', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/login`)
      .send(sample.inValidLoginCreds)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.invalidLoginCreds);
        done();
      });
  });
  it('Correct identifier but wrong password should return 401', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/login`)
      .send(sample.invalidCredentials)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(unauthorized);
        expect(error);
        expect(error).to.equal(messages.invalidCredentials);
        done();
      });
  });
  it('Correct credentials but unverified user should return 401', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/login`)
      .send(sample.loginUnverifiedUser)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(unauthorized);
        expect(error);
        expect(error).to.equal(messages.loginUserNotVerified);
        done();
      });
  });
  it('Unregistered user should return 404', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/login`)
      .send(sample.loginUserNotFound)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(notFound);
        expect(error);
        expect(error).to.equal(messages.loginUserNotFound);
        done();
      });
  });
  it('Valid Email Login should return 200', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/login`)
      .send(sample.validLoginEmail)
      .end((err, res) => {
        if (err) done(err);
        const { message, token, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.validLoginCreds);
        expect(token);
        userToken = token;
        expect(userToken).to.be.a('string');
        expect(data);
        expect(data).to.haveOwnProperty('id');
        expect(data).to.haveOwnProperty('firstName');
        done();
      });
  });
  it('Valid Phone Login should return 200', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/login`)
      .send(sample.validLoginPhone)
      .end((err, res) => {
        if (err) done(err);
        const { message, token, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.validLoginCreds);
        expect(token);
        userToken = token;
        expect(userToken).to.be.a('string');
        expect(data);
        expect(data).to.be.a('object');
        done();
      });
  });
});
