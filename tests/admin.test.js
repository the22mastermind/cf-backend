import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';
import statusCodes from '../src/utils/statusCodes';
import messages from '../src/utils/messages';
import sample from './samples/admin';
import db from '../src/models';

const {
  badRequest,
  conflict,
  created,
  success,
  forbidden,
  notFound,
  unauthorized,
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
        expect(data).to.haveOwnProperty('tags');
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
        expect(data).to.haveOwnProperty('available');
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
        expect(data).to.haveOwnProperty('available');
        expect(data).to.haveOwnProperty('categoryId');
        done();
      });
  });
  it('Valid market product (items) should return 201', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}/category/3/product`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(sample.validProductMarketItems)
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
        expect(data).to.haveOwnProperty('available');
        expect(data).to.haveOwnProperty('categoryId');
        expect(data).to.haveOwnProperty('quantity');
        expect(data.quantity).to.equal('4 items');
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

describe('USER FETCH OWN SUBSCRIPTION', () => {
  it('Login user should return 200', (done) => {
    chai
      .request(server)
      .post('/auth/login')
      .send({
        identifier: 'denzel@gmail.com',
        password: 'denzel@1bro',
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
  it('User fetch own subscription should return 200', (done) => {
    chai
      .request(server)
      .get('/subscription')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.subscriptionFound);
        expect(data);
        expect(data).to.be.a('array');
        expect(data[0]).to.haveOwnProperty('id');
        expect(data[0]).to.haveOwnProperty('userId');
        expect(data[0]).to.haveOwnProperty('planId');
        expect(data[0]).to.haveOwnProperty('days');
        expect(data[0]).to.haveOwnProperty('allergies');
        expect(data[0]).to.haveOwnProperty('vegan');
        expect(data[0]).to.haveOwnProperty('people');
        expect(data[0]).to.haveOwnProperty('status');
        expect(data[0]).to.haveOwnProperty('expiresOn');
        expect(data[0].planId).to.equal(data[0].plan.id);
        expect(data[0].userId).to.equal(data[0].user.id);
        expect(data[0].plan).to.haveOwnProperty('id');
        expect(data[0].plan).to.haveOwnProperty('name');
        expect(data[0].plan).to.haveOwnProperty('description');
        done();
      });
  });
});

describe('ADMIN FETCH SUBSCRIPTIONS', () => {
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
  it('Admin fetch all subscriptions should return 200', (done) => {
    chai
      .request(server)
      .get('/admin/subscriptions')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.subscriptionsFound);
        expect(data);
        expect(data).to.be.a('array');
        expect(data[0]).to.haveOwnProperty('id');
        expect(data[0]).to.haveOwnProperty('userId');
        expect(data[0]).to.haveOwnProperty('planId');
        expect(data[0]).to.haveOwnProperty('days');
        expect(data[0]).to.haveOwnProperty('allergies');
        expect(data[0]).to.haveOwnProperty('vegan');
        expect(data[0]).to.haveOwnProperty('people');
        expect(data[0]).to.haveOwnProperty('status');
        expect(data[0]).to.haveOwnProperty('expiresOn');
        expect(data[0].planId).to.equal(data[0].plan.id);
        expect(data[0].userId).to.equal(data[0].user.id);
        done();
      });
  });
  it('Admin fetch subscriptions by plan should return 200', (done) => {
    chai
      .request(server)
      .get('/admin/plans/1/subscriptions')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.subscriptionsFound);
        expect(data);
        expect(data).to.be.a('array');
        expect(data[0]).to.haveOwnProperty('id');
        expect(data[0]).to.haveOwnProperty('userId');
        expect(data[0]).to.haveOwnProperty('planId');
        expect(data[0]).to.haveOwnProperty('days');
        expect(data[0]).to.haveOwnProperty('allergies');
        expect(data[0]).to.haveOwnProperty('vegan');
        expect(data[0]).to.haveOwnProperty('people');
        expect(data[0]).to.haveOwnProperty('status');
        expect(data[0]).to.haveOwnProperty('expiresOn');
        expect(data[0].planId).to.equal(data[0].plan.id);
        expect(data[0].userId).to.equal(data[0].user.id);
        done();
      });
  });
  it('Should delete all subscriptions', async () => {
    await db.sequelize.query('DELETE FROM subscriptions');
  });
  it('No subscriptions found should return 404', (done) => {
    chai
      .request(server)
      .get('/admin/subscriptions')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(notFound);
        expect(error);
        expect(error).to.equal(messages.subscriptionsNotFound);
        done();
      });
  });
  it('No subscriptions by plan should return 404', (done) => {
    chai
      .request(server)
      .get('/admin/plans/1/subscriptions')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(notFound);
        expect(error);
        expect(error).to.equal(messages.subscriptionsNotFound);
        done();
      });
  });
  it('Subscriptions for unexisting plan should return 404', (done) => {
    chai
      .request(server)
      .get('/admin/plans/99/subscriptions')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(notFound);
        expect(error);
        expect(error).to.equal(messages.subscriptionsNotFound);
        done();
      });
  });
  it('Subscriptions for invalid plan id should return 400', (done) => {
    chai
      .request(server)
      .get('/admin/plans/abc/subscriptions')
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
  it('Fetch subscription plans should return 200', (done) => {
    chai
      .request(server)
      .get('/plans')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.plansFound);
        expect(data);
        expect(data).to.be.a('array');
        expect(data[0]).to.haveOwnProperty('id');
        expect(data[0]).to.haveOwnProperty('name');
        expect(data[0]).to.haveOwnProperty('description');
        expect(data[0]).to.haveOwnProperty('price');
        expect(data[0]).to.haveOwnProperty('currency');
        expect(data[0]).to.haveOwnProperty('options');
        expect(data[0].options).to.be.a('array');
        expect(data[0].options[0]).to.be.a('string');
        done();
      });
  });
  it('Should delete all subscription plans', async () => {
    await db.sequelize.query('DELETE FROM plans');
  });
  it('No subscription plans should return 404', (done) => {
    chai
      .request(server)
      .get('/plans')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(notFound);
        expect(error);
        expect(error).to.equal(messages.plansNotFound);
        done();
      });
  });
});

describe('USER FETCH UNEXISTANT SUBSCRIPTION', () => {
  it('Login user should return 200', (done) => {
    chai
      .request(server)
      .post('/auth/login')
      .send({
        identifier: 'denzel@gmail.com',
        password: 'denzel@1bro',
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
  it('No subscription found should return 404', (done) => {
    chai
      .request(server)
      .get('/subscription')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(notFound);
        expect(error);
        expect(error).to.equal(messages.subscriptionNotFound);
        done();
      });
  });
});

describe('ADMIN CREATE SUBSCRIPTION PLANS', () => {
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
  it('Create subscription plan with invalid name should return 400', (done) => {
    chai
      .request(server)
      .post('/admin/plans')
      .set('Authorization', `Bearer ${userToken}`)
      .send(sample.invalidPlanName)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.invalidPlanName);
        done();
      });
  });
  it('Create subscription plan with invalid description should return 400', (done) => {
    chai
      .request(server)
      .post('/admin/plans')
      .set('Authorization', `Bearer ${userToken}`)
      .send(sample.invalidPlanDescription)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.invalidPlanDesc);
        done();
      });
  });
  it('Create subscription plan with invalid price should return 400', (done) => {
    chai
      .request(server)
      .post('/admin/plans')
      .set('Authorization', `Bearer ${userToken}`)
      .send(sample.invalidPlanPrice)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.invalidPlanPrice);
        done();
      });
  });
  it('Create subscription plan with invalid currency should return 400', (done) => {
    chai
      .request(server)
      .post('/admin/plans')
      .set('Authorization', `Bearer ${userToken}`)
      .send(sample.invalidPlanCurrency)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.orderInvalidCurrency);
        done();
      });
  });
  it('Create subscription plan with invalid options should return 400', (done) => {
    chai
      .request(server)
      .post('/admin/plans')
      .set('Authorization', `Bearer ${userToken}`)
      .send(sample.invalidPlanOptions)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.invalidPlanOptions);
        done();
      });
  });
  it('Admin create subscription plan should return 201', (done) => {
    chai
      .request(server)
      .post('/admin/plans')
      .set('Authorization', `Bearer ${userToken}`)
      .send(sample.validPlan)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(message).to.equal(messages.planCreated);
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('id');
        expect(data).to.haveOwnProperty('name');
        expect(data).to.haveOwnProperty('description');
        expect(data).to.haveOwnProperty('price');
        expect(data).to.haveOwnProperty('currency');
        expect(data).to.haveOwnProperty('options');
        expect(data.options).to.be.a('array');
        expect(data.options[0]).to.be.a('string');
        done();
      });
  });
  it('Create subscription plan that already exists should return 409', (done) => {
    chai
      .request(server)
      .post('/admin/plans')
      .set('Authorization', `Bearer ${userToken}`)
      .send(sample.validPlan)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(conflict);
        expect(error);
        expect(error).to.equal(messages.planConflict);
        done();
      });
  });
  it('Should delete all subscription plans', async () => {
    await db.sequelize.query('DELETE FROM plans');
  });
});

describe('ADMIN FETCH USERS', () => {
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
  it('Fetch all users should return 200', (done) => {
    chai
      .request(server)
      .get('/admin/users')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.usersFound);
        expect(data);
        expect(data).to.be.a('array');
        expect(data[0]).to.haveOwnProperty('id');
        expect(data[0]).to.haveOwnProperty('firstName');
        expect(data[0]).to.haveOwnProperty('lastName');
        expect(data[0]).to.haveOwnProperty('email');
        expect(data[0]).to.haveOwnProperty('phone');
        expect(data[0]).to.haveOwnProperty('address');
        expect(data[0]).to.haveOwnProperty('role');
        expect(data[0]).to.haveOwnProperty('isVerified');
        expect(data[0]).to.haveOwnProperty('profileComplete');
        expect(data[0]).to.haveOwnProperty('vendor');
        expect(data[0]).to.haveOwnProperty('review');
        expect(data[0]).to.haveOwnProperty('orders');
        expect(data[0]).to.haveOwnProperty('subscription');
        done();
      });
  });
});

describe('ADMIN ADD USER', () => {
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
  it('Add an invalid rider should return 400', (done) => {
    chai
      .request(server)
      .post('/admin/users')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        done();
      });
  });
  it('Add valid rider should return 200', (done) => {
    chai
      .request(server)
      .post('/admin/users')
      .set('Authorization', `Bearer ${userToken}`)
      .send(sample.validRider)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(message).to.equal(messages.adminAddUserSuccess);
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('id');
        expect(data).to.haveOwnProperty('firstName');
        expect(data).to.haveOwnProperty('lastName');
        expect(data).to.haveOwnProperty('email');
        expect(data).to.haveOwnProperty('phone');
        expect(data).to.haveOwnProperty('role');
        expect(data).to.haveOwnProperty('isVerified');
        expect(data).to.haveOwnProperty('profileComplete');
        done();
      });
  });
  it('Add existing rider should return 409', (done) => {
    chai
      .request(server)
      .post('/admin/users')
      .set('Authorization', `Bearer ${userToken}`)
      .send(sample.validRider)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(conflict);
        expect(error);
        expect(error).to.equal(messages.adminAddUserConflict);
        done();
      });
  });
});

describe('ADMIN DISABLE/ENABLE USER', () => {
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
  it('Deactivating a user should return 200', (done) => {
    chai
      .request(server)
      .patch('/admin/users/8')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        status: 'deactive',
      })
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.adminUpdateUserStatus);
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('id');
        expect(data).to.haveOwnProperty('firstName');
        expect(data).to.haveOwnProperty('lastName');
        expect(data).to.haveOwnProperty('email');
        expect(data).to.haveOwnProperty('phone');
        expect(data).to.haveOwnProperty('role');
        expect(data).to.haveOwnProperty('isVerified');
        expect(data.isVerified).to.equal(false);
        done();
      });
  });
  it('Login deactivated user should return 401', (done) => {
    chai
      .request(server)
      .post('/auth/login')
      .send({
        identifier: 'blackpanther@gmail.com',
        password: 'black@panther',
      })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(unauthorized);
        expect(error);
        expect(error).to.equal(messages.loginUserNotVerified);
        done();
      });
  });
  it('Activating a user should return 200', (done) => {
    chai
      .request(server)
      .patch('/admin/users/8')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        status: 'active',
      })
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.adminUpdateUserStatus);
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('id');
        expect(data).to.haveOwnProperty('firstName');
        expect(data).to.haveOwnProperty('lastName');
        expect(data).to.haveOwnProperty('email');
        expect(data).to.haveOwnProperty('phone');
        expect(data).to.haveOwnProperty('role');
        expect(data).to.haveOwnProperty('isVerified');
        expect(data.isVerified).to.equal(true);
        done();
      });
  });
  it('Login active user should return 200', (done) => {
    chai
      .request(server)
      .post('/auth/login')
      .send({
        identifier: 'blackpanther@gmail.com',
        password: 'black@panther',
      })
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.validLoginCreds);
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('email');
        expect(data.email).to.equal('blackpanther@gmail.com');
        done();
      });
  });
});
