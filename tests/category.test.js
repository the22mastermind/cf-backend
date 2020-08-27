import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';
import statusCodes from '../src/utils/statusCodes';
import messages from '../src/utils/messages';
import sample from './samples/authentication';
import userSample from './samples/user';
import db from '../src/models';

const {
  success,
  notFound,
  badRequest,
  created,
  conflict,
} = statusCodes;
const baseUrl = '/categories';

chai.use(chaiHttp);
chai.should();

let userToken = null;

describe('USER FETCH ALL CATEGORIES', () => {
  it('User login should return 200', (done) => {
    chai
      .request(server)
      .post('/auth/login')
      .send(sample.regularUser)
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
  it('Categories found should return 200', (done) => {
    chai
      .request(server)
      .get(`${baseUrl}`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.categoriesFound);
        expect(data);
        expect(data).to.be.a('array');
        expect(data[0]).to.haveOwnProperty('id');
        expect(data[0]).to.haveOwnProperty('name');
        expect(data[0]).to.haveOwnProperty('description');
        done();
      });
  });
});

describe('USER FETCH PRODUCTS BY CATEGORY', () => {
  it('Products found should return 200', (done) => {
    chai
      .request(server)
      .get(`${baseUrl}/2/products`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.productsFound);
        expect(data);
        expect(data).to.be.a('array');
        expect(data[0]).to.haveOwnProperty('id');
        expect(data[0]).to.haveOwnProperty('name');
        expect(data[0]).to.haveOwnProperty('description');
        expect(data[0]).to.haveOwnProperty('cost');
        done();
      });
  });
  it('Products not found should return 404', (done) => {
    chai
      .request(server)
      .get(`${baseUrl}/4/products`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(notFound);
        expect(error);
        expect(error).to.equal(messages.productsNotFound);
        done();
      });
  });
  it('Unexistant category id should return 404', (done) => {
    chai
      .request(server)
      .get(`${baseUrl}/100/products`)
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
});

describe('USER FETCH SINGLE PRODUCT', () => {
  it('Product found should return 200', (done) => {
    chai
      .request(server)
      .get('/product/1')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.productFound);
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('id');
        expect(data).to.haveOwnProperty('name');
        expect(data).to.haveOwnProperty('description');
        expect(data).to.haveOwnProperty('cost');
        expect(data.category).to.haveOwnProperty('id');
        expect(data.category).to.haveOwnProperty('name');
        expect(data.category).to.haveOwnProperty('description');
        expect(data.categoryId).to.equal(data.category.id);
        done();
      });
  });
  it('Product not found should return 404', (done) => {
    chai
      .request(server)
      .get('/product/100')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(notFound);
        expect(error);
        expect(error).to.equal(messages.productNotFound);
        done();
      });
  });
  it('Invalid product id should return 400', (done) => {
    chai
      .request(server)
      .get('/product/hello')
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

describe('USER ADD PRODUCT REVIEW', () => {
  it('User add valid review should return 201', (done) => {
    chai
      .request(server)
      .post('/product/1/reviews')
      .set('Authorization', `Bearer ${userToken}`)
      .send(userSample.productReviewValid)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(message).to.equal(messages.reviewAdded);
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('id');
        expect(data).to.haveOwnProperty('vote');
        expect(data).to.haveOwnProperty('comment');
        done();
      });
  });
  it('Same user add valid review should return 409', (done) => {
    chai
      .request(server)
      .post('/product/1/reviews')
      .set('Authorization', `Bearer ${userToken}`)
      .send(userSample.productReviewValid)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(conflict);
        expect(error);
        expect(error).to.equal(messages.reviewConflict);
        done();
      });
  });
  it('Product not found should return 404', (done) => {
    chai
      .request(server)
      .post('/product/100/reviews')
      .set('Authorization', `Bearer ${userToken}`)
      .send(userSample.productReviewValid)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(notFound);
        expect(error);
        expect(error).to.equal(messages.productNotFound);
        done();
      });
  });
  it('User add review without vote should return 400', (done) => {
    chai
      .request(server)
      .post('/product/1/reviews')
      .set('Authorization', `Bearer ${userToken}`)
      .send(userSample.productReviewEmptyVote)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.reviewAddEmptyVote);
        done();
      });
  });
  it('New user login should return 200', (done) => {
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
  it('New user add valid review should return 201', (done) => {
    chai
      .request(server)
      .post('/product/1/reviews')
      .set('Authorization', `Bearer ${userToken}`)
      .send(userSample.productReviewValidTwo)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(message).to.equal(messages.reviewAdded);
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('id');
        expect(data).to.haveOwnProperty('vote');
        expect(data).to.haveOwnProperty('comment');
        done();
      });
  });
  it('New user login should return 200', (done) => {
    chai
      .request(server)
      .post('/auth/login')
      .send({
        identifier: 'deniro@gmail.com',
        password: 'deniro@1bro',
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
  it('New user add valid review should return 201', (done) => {
    chai
      .request(server)
      .post('/product/1/reviews')
      .set('Authorization', `Bearer ${userToken}`)
      .send(userSample.productReviewValidThree)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(message).to.equal(messages.reviewAdded);
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('id');
        expect(data).to.haveOwnProperty('vote');
        expect(data).to.haveOwnProperty('comment');
        done();
      });
  });
});

describe('USER FETCH ALL CATEGORIES NOT FOUND', () => {
  beforeEach('Delete all categories', async () => {
    await db.sequelize.query('DELETE FROM reviews');
    await db.sequelize.query('DELETE FROM products');
    await db.sequelize.query('DELETE FROM categories');
  });
  it('No categories found should return 404', (done) => {
    chai
      .request(server)
      .get(`${baseUrl}`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(notFound);
        expect(error);
        expect(error).to.equal(messages.categoriesNotFound);
        done();
      });
  });
});
