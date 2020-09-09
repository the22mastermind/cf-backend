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
  notFound,
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

describe('ADMIN VIEW SINGLE VENDOR', () => {
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
      .get(`${baseUrl}/vendor/1`)
      .set('Authorization', `Bearer ${userToken}`)
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
  it('Admin fetch single vendor should return 200', (done) => {
    chai
      .request(server)
      .get(`${baseUrl}/vendor/1`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.adminVendorFetchSuccess);
        expect(data);
        expect(data).to.haveOwnProperty('id');
        expect(data).to.haveOwnProperty('userId');
        expect(data).to.haveOwnProperty('status');
        done();
      });
  });
  it('Fetching unexistant vendor should return 404', (done) => {
    chai
      .request(server)
      .get(`${baseUrl}/vendor/9999`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(notFound);
        expect(error);
        expect(error).to.equal(messages.adminVendorFetchNotFound);
        done();
      });
  });
  it('Fetching vendor with invalid id should return 400', (done) => {
    chai
      .request(server)
      .get(`${baseUrl}/vendor/1ab1`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.adminVendorFetchBadId);
        done();
      });
  });
});

describe('ADMIN CREATE CATEGORY', () => {
  it('Empty name should return 400', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/category`)
      .send(sample.emptyCategoryName)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.adminAddCategoryEmptyName);
        done();
      });
  });
  it('Invalid category name should return 400', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/category`)
      .send(sample.invalidCategoryName)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.adminAddCategoryInvalidName);
        done();
      });
  });
  it('Invalid category description should return 400', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/category`)
      .send(sample.invalidCategoryDescription)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.adminAddCategoryInvalidDesc);
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
  it('Valid category should return 201', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/category`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(sample.validCategory)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(message).to.equal(messages.adminAddCategory);
        expect(data);
        expect(data).to.haveOwnProperty('id');
        expect(data).to.haveOwnProperty('name');
        expect(data).to.haveOwnProperty('description');
        done();
      });
  });
  it('Adding existing category should return 409', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/category`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(sample.validCategory)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(conflict);
        expect(error);
        expect(error).to.equal(messages.adminAddCategoryDuplicate);
        done();
      });
  });
});

describe('ADMIN DELETE CATEGORY', () => {
  it('Invalid id should return 400', (done) => {
    chai
      .request(server)
      .delete(`${baseUrl}/category/abc`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.adminVendorFetchBadId);
        done();
      });
  });
  it('Unexistant category id should return 404', (done) => {
    chai
      .request(server)
      .delete(`${baseUrl}/category/999`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(notFound);
        expect(error);
        expect(error).to.equal(messages.categoryNotFound);
        done();
      });
  });
  it('Valid category id should return 200', (done) => {
    chai
      .request(server)
      .delete(`${baseUrl}/category/1`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.adminDeleteCategory);
        expect(data);
        expect(data).to.equal(1);
        done();
      });
  });
});

describe('ADMIN ADD PRODUCT', () => {
  it('Empty name should return 400', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/category/2/product`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(sample.emptyProductName)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.adminAddCategoryEmptyName);
        done();
      });
  });
  it('Empty cost should return 400', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/category/2/product`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(sample.emptyProductCost)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.emptyProductCost);
        done();
      });
  });
  it('Invalid category id should return 400', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/category/abc/product`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(sample.validProductDrink)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.adminVendorFetchBadId);
        done();
      });
  });
  it('Valid product (drinks) should return 201', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/category/2/product`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(sample.validProductDrink)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(message).to.equal(messages.productAddSuccess);
        expect(data);
        expect(data).to.haveOwnProperty('id');
        expect(data).to.haveOwnProperty('name');
        expect(data).to.haveOwnProperty('description');
        expect(data).to.haveOwnProperty('categoryId');
        done();
      });
  });
  it('Valid product (market) should return 201', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/category/3/product`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(sample.validProductMarket)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(message).to.equal(messages.productAddSuccess);
        expect(data);
        expect(data).to.haveOwnProperty('id');
        expect(data).to.haveOwnProperty('name');
        expect(data).to.haveOwnProperty('description');
        expect(data).to.haveOwnProperty('categoryId');
        done();
      });
  });
});

describe('ADMIN FETCH ALL ORDERS', () => {
  it('Login admin should return 200', (done) => {
    chai
      .request(server)
      .post('/auth/login')
      .send({
        identifier: 'admin@gmail.com',
        password: 'hellowordl@0',
      })
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
  it('Admin fetch all orders should return 404', (done) => {
    chai
      .request(server)
      .get('/admin/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(notFound);
        expect(error);
        expect(error).to.equal(messages.ordersNotFound);
        done();
      });
  });
});

describe('ADMIN UPDATE USER SUBSCRIPTION', () => {
  it('Admin approving user subscription status should return 200', (done) => {
    chai
      .request(server)
      .patch('/admin/subscriptions/users/2')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ status: 'active' })
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.subscriptionUpdateStatus);
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('id');
        expect(data).to.haveOwnProperty('userId');
        expect(data).to.haveOwnProperty('planId');
        expect(data).to.haveOwnProperty('days');
        expect(data).to.haveOwnProperty('allergies');
        expect(data).to.haveOwnProperty('vegan');
        expect(data).to.haveOwnProperty('people');
        expect(data).to.haveOwnProperty('status');
        expect(data.status).to.equal('active');
        expect(data).to.haveOwnProperty('expiresOn');
        done();
      });
  });
  it('Admin update user subscription status to existing status should return 409', (done) => {
    chai
      .request(server)
      .patch('/admin/subscriptions/users/2')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ status: 'active' })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(conflict);
        expect(error);
        expect(error).to.equal(messages.subscriptionUpdateStatusConflict);
        done();
      });
  });
  it('Admin update subscription status of user who does not have a subscription should return 404', (done) => {
    chai
      .request(server)
      .patch('/admin/subscriptions/users/4')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ status: 'active' })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(notFound);
        expect(error);
        expect(error).to.equal(messages.subscriptionUpdateStatusNotFound);
        done();
      });
  });
  it('Invalid subscription status should return 400', (done) => {
    chai
      .request(server)
      .patch('/admin/subscriptions/users/2')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ status: 'something' })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.subscriptionUpdateStatusInvalid);
        done();
      });
  });
  it('Admin update user subscription without status should return 400', (done) => {
    chai
      .request(server)
      .patch('/admin/subscriptions/users/2')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.orderUpdateStatusEmpty);
        done();
      });
  });
  it('Admin update subscription status of unexistant user should return 404', (done) => {
    chai
      .request(server)
      .patch('/admin/subscriptions/users/999')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ status: 'active' })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(notFound);
        expect(error);
        expect(error).to.equal(messages.userNotExist);
        done();
      });
  });
});
