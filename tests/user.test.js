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
  forbidden,
} = statusCodes;
const baseUrl = '/categories';

chai.use(chaiHttp);
chai.should();

let userToken = null;
let adminToken = null;
let riderToken = null;
let orderId = null;

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
        expect(data).to.haveOwnProperty('available');
        expect(data.available).to.be.a('boolean');
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

describe('USER FETCH ALL PRODUCTS', () => {
  it('Products found should return 200', (done) => {
    chai
      .request(server)
      .get('/products')
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
        expect(data[0]).to.haveOwnProperty('currency');
        expect(data[0]).to.haveOwnProperty('image');
        expect(data[0]).to.haveOwnProperty('categoryId');
        expect(data[0].categoryId).to.equal(data[0].category.id);
        expect(data[0].category.name).to.be.a('string');
        expect(data[0]).to.haveOwnProperty('reviews');
        expect(data[0].reviews).to.be.a('array');
        expect(data[0].reviews[0]).to.haveOwnProperty('id');
        expect(data[0].reviews[0]).to.haveOwnProperty('productId');
        expect(data[0].reviews[0]).to.haveOwnProperty('userId');
        expect(data[0].reviews[0]).to.haveOwnProperty('average');
        expect(data[0].reviews[0]).to.haveOwnProperty('vote');
        expect(data[0].reviews[0]).to.haveOwnProperty('comment');
        expect(data[0].reviews[0]).to.haveOwnProperty('user');
        expect(data[0].reviews[0].user).to.haveOwnProperty('firstName');
        expect(data[0].reviews[0].user).to.haveOwnProperty('lastName');
        done();
      });
  });
});

describe('USER PLACE ORDER', () => {
  it('User login should return 200', (done) => {
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
  it('User fetch own unexistant orders should return 404', (done) => {
    chai
      .request(server)
      .get('/orders')
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
  it('User place order should return 201', (done) => {
    chai
      .request(server)
      .post('/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send(userSample.validOrder)
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(message).to.equal(messages.orderPlaced);
        done();
      });
  });
  it('User place order should return 201', (done) => {
    chai
      .request(server)
      .post('/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send(userSample.validOrderTwo)
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(message).to.equal(messages.orderPlaced);
        done();
      });
  });
  it('User place order should return 201', (done) => {
    chai
      .request(server)
      .post('/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send(userSample.validOrderThree)
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(message).to.equal(messages.orderPlaced);
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
  it('New user place order should return 201', (done) => {
    chai
      .request(server)
      .post('/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send(userSample.validOrderThree)
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(message).to.equal(messages.orderPlaced);
        done();
      });
  });
  it('User place order without contents should return 400', (done) => {
    chai
      .request(server)
      .post('/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send(userSample.emptyContentsOrder)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.orderInvalidContents);
        done();
      });
  });
  it('User place order with invalid contents should return 400', (done) => {
    chai
      .request(server)
      .post('/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send(userSample.invalidContentsOrder)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(`${messages.orderInvalidContents}, ${messages.orderInvalidContents}, ${messages.orderInvalidContents}, ${messages.orderInvalidContents}, ${messages.orderInvalidContents}`);
        done();
      });
  });
});

describe('USER GET ORDERS', () => {
  it('User fetch own orders should return 200', (done) => {
    chai
      .request(server)
      .get('/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.ordersFound);
        expect(data);
        expect(data).to.be.a('array');
        expect(data[0].orderContents).to.be.a('array');
        expect(data[0].user).to.be.a('object');
        expect(data[0].userId).to.equal(data[0].user.id);
        expect(data[0].user).to.haveOwnProperty('id');
        expect(data[0].user).to.haveOwnProperty('firstName');
        expect(data[0].user).to.haveOwnProperty('lastName');
        expect(data[0].user).to.haveOwnProperty('phone');
        expect(data[0].user).to.haveOwnProperty('address');
        expect(data[0].orderContents[0]).to.haveOwnProperty('id');
        expect(data[0].orderContents[0]).to.haveOwnProperty('productId');
        expect(data[0].orderContents[0]).to.haveOwnProperty('productName');
        expect(data[0].orderContents[0]).to.haveOwnProperty('quantity');
        expect(data[0].orderContents[0]).to.haveOwnProperty('cost');
        expect(data[0].orderContents[0]).to.haveOwnProperty('orderId');
        expect(data[0].id).to.equal(data[0].orderContents[0].orderId);
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
  it('Products not found should return 404', (done) => {
    chai
      .request(server)
      .get('/products')
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
});

describe('ADMIN UPDATE & FETCH ORDERS', () => {
  it('User change order status should return 403', (done) => {
    chai
      .request(server)
      .patch('/admin/orders/2')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ status: 'processing' })
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
      .send({
        identifier: 'admin@gmail.com',
        password: 'hellowordl@0',
      })
      .end((err, res) => {
        if (err) done(err);
        const { token } = res.body;
        expect(res.status).to.equal(success);
        expect(token);
        adminToken = token;
        expect(adminToken).to.be.a('string');
        done();
      });
  });
  it('Admin change order status with invalid order id should return 400', (done) => {
    chai
      .request(server)
      .patch('/admin/orders/hahah')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'processing' })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.adminVendorFetchBadId);
        done();
      });
  });
  it('Admin change order status with unexistant order id should return 404', (done) => {
    chai
      .request(server)
      .patch('/admin/orders/999')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'processing' })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(notFound);
        expect(error);
        expect(error).to.equal(messages.orderNotFound);
        done();
      });
  });
  it('Admin change order status without status should return 400', (done) => {
    chai
      .request(server)
      .patch('/admin/orders/2')
      .set('Authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.orderUpdateStatusEmpty);
        done();
      });
  });
  it('Admin change order status should return 200', (done) => {
    chai
      .request(server)
      .patch('/admin/orders/2')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'processing' })
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.orderUpdateStatus);
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('id');
        expect(data).to.haveOwnProperty('txId');
        expect(data).to.haveOwnProperty('total');
        expect(data).to.haveOwnProperty('paymentMode');
        expect(data).to.haveOwnProperty('currency');
        expect(data).to.haveOwnProperty('address');
        expect(data).to.haveOwnProperty('userId');
        expect(data).to.haveOwnProperty('status');
        done();
      });
  });
  it('Admin change order status again should return 409', (done) => {
    chai
      .request(server)
      .patch('/admin/orders/2')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'processing' })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(conflict);
        expect(error);
        expect(error).to.equal(messages.orderUpdateStatusConflict);
        done();
      });
  });
  it('Admin fetch all orders should return 200', (done) => {
    chai
      .request(server)
      .get('/admin/orders')
      .set('Authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.ordersFound);
        expect(data);
        expect(data).to.be.a('array');
        expect(data[0].orderContents).to.be.a('array');
        expect(data[0].user).to.be.a('object');
        expect(data[0].userId).to.equal(data[0].user.id);
        expect(data[0].user).to.haveOwnProperty('id');
        expect(data[0].user).to.haveOwnProperty('firstName');
        expect(data[0].user).to.haveOwnProperty('lastName');
        expect(data[0].user).to.haveOwnProperty('phone');
        expect(data[0].user).to.haveOwnProperty('address');
        expect(data[0].orderContents[0]).to.haveOwnProperty('id');
        expect(data[0].orderContents[0]).to.haveOwnProperty('productId');
        expect(data[0].orderContents[0]).to.haveOwnProperty('productName');
        expect(data[0].orderContents[0]).to.haveOwnProperty('quantity');
        expect(data[0].orderContents[0]).to.haveOwnProperty('cost');
        expect(data[0].orderContents[0]).to.haveOwnProperty('orderId');
        expect(data[0].id).to.equal(data[0].orderContents[0].orderId);
        done();
      });
  });
});

describe('USER SUBSCRIBE', () => {
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
  it('User subscribing to unexistant plan should return 404', (done) => {
    chai
      .request(server)
      .post('/plans/5/subscription')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        vegan: true,
        allergies: ['Milk'],
        people: 1,
      })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(notFound);
        expect(error);
        expect(error).to.equal(messages.planNotFound);
        done();
      });
  });
  it('Insert sample plan', async () => {
    await db.sequelize.query("INSERT INTO plans VALUES(1, 'BASIC', 'Description of the basic plan', 100000, 'RWF', NOW(), NOW());");
    await db.sequelize.query("INSERT INTO plans VALUES(2, 'PREMIUM', 'Description of the premium plan', 500000, 'RWF', NOW(), NOW());");
  });
  it('User subscribing to a valid plan should return 201', (done) => {
    chai
      .request(server)
      .post('/plans/1/subscription')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        vegan: false,
        allergies: ['Soy', 'Wheat'],
        people: 1,
      })
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(message).to.equal(messages.userSubscribe);
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('id');
        expect(data).to.haveOwnProperty('days');
        expect(data.days).to.be.a('array');
        expect(data).to.haveOwnProperty('vegan');
        expect(data.vegan).to.be.a('boolean');
        expect(data).to.haveOwnProperty('allergies');
        expect(data.allergies).to.be.a('array');
        expect(data).to.haveOwnProperty('people');
        expect(data.people).to.be.a('number');
        expect(data).to.haveOwnProperty('status');
        expect(data).to.haveOwnProperty('userId');
        expect(data).to.haveOwnProperty('planId');
        done();
      });
  });
  it('User subscribing with existant subscription should return 409', (done) => {
    chai
      .request(server)
      .post('/plans/1/subscription')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        vegan: true,
        allergies: ['Milk'],
        people: 1,
      })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(conflict);
        expect(error);
        expect(error).to.equal(messages.userSubscribePending);
        done();
      });
  });
  it('Change subscription status', async () => {
    await db.sequelize.query("UPDATE subscriptions SET status='active';");
  });
  it('User subscribing with existant subscription should return 409', (done) => {
    chai
      .request(server)
      .post('/plans/1/subscription')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        vegan: true,
        allergies: ['Milk'],
        people: 1,
      })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(conflict);
        expect(error);
        expect(error).to.equal(messages.userSubscribeConflict);
        done();
      });
  });
  it('User subscribe with invalid vegan info should return 400', (done) => {
    chai
      .request(server)
      .post('/plans/1/subscription')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        allergies: ['Milk'],
        people: 1,
        vegan: 'yes',
      })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.veganInvalid);
        done();
      });
  });
  it('User subscribe without people info should return 400', (done) => {
    chai
      .request(server)
      .post('/plans/1/subscription')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        allergies: ['Milk'],
        vegan: true,
      })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.peopleInvalid);
        done();
      });
  });
  it('User subscribe with invalid allergies info should return 400', (done) => {
    chai
      .request(server)
      .post('/plans/1/subscription')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        allergies: [],
        vegan: true,
      })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.peopleInvalid);
        done();
      });
  });
  it('User subscribe with invalid allergies info should return 400', (done) => {
    chai
      .request(server)
      .post('/plans/1/subscription')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        allergies: 'soy',
        vegan: false,
        people: 5,
      })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.allergiesInvalid);
        done();
      });
  });
  it('User subscribe with invalid people info should return 400', (done) => {
    chai
      .request(server)
      .post('/plans/1/subscription')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        allergies: ['soy'],
        vegan: false,
        people: 6,
      })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.peopleInvalid);
        done();
      });
  });
  it('Login new user should return 200', (done) => {
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
  it('User subscribing to a valid plan should return 201', (done) => {
    chai
      .request(server)
      .post('/plans/2/subscription')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        vegan: true,
        allergies: ['Milk'],
        people: 2,
      })
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(message).to.equal(messages.userSubscribe);
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('id');
        expect(data).to.haveOwnProperty('days');
        expect(data.days).to.be.a('array');
        expect(data).to.haveOwnProperty('vegan');
        expect(data.vegan).to.be.a('boolean');
        expect(data).to.haveOwnProperty('allergies');
        expect(data.allergies).to.be.a('array');
        expect(data).to.haveOwnProperty('people');
        expect(data.people).to.be.a('number');
        expect(data).to.haveOwnProperty('status');
        expect(data).to.haveOwnProperty('userId');
        expect(data).to.haveOwnProperty('planId');
        done();
      });
  });
});

describe('USER FETCH ALL VENDORS', () => {
  it('User login should return 200', (done) => {
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
  it('Vendors found should return 200', (done) => {
    chai
      .request(server)
      .get('/vendors')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.vendorsFound);
        expect(data);
        expect(data).to.be.a('array');
        expect(data[0]).to.haveOwnProperty('id');
        expect(data[0]).to.haveOwnProperty('name');
        expect(data[0]).to.haveOwnProperty('tin');
        expect(data[0]).to.haveOwnProperty('website');
        expect(data[0]).to.haveOwnProperty('status');
        expect(data[0]).to.haveOwnProperty('tags');
        expect(data[0]).to.haveOwnProperty('userId');
        expect(data[0]).to.haveOwnProperty('user');
        expect(data[0].user).to.haveOwnProperty('id');
        expect(data[0].userId).to.equal(data[0].user.id);
        done();
      });
  });
  it('Delete all vendors', async () => {
    await db.sequelize.query('DELETE FROM vendors;');
  });
  it('Vendors not found should return 404', (done) => {
    chai
      .request(server)
      .get('/vendors')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(notFound);
        expect(error);
        expect(error).to.equal(messages.vendorsNotFound);
        done();
      });
  });
});

describe('ADMIN FETCH SUMMARY', () => {
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
        adminToken = token;
        expect(adminToken).to.be.a('string');
        done();
      });
  });
  it('Fetch summary should return 200', (done) => {
    chai
      .request(server)
      .get('/admin/summary')
      .set('Authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { data } = res.body;
        expect(res.status).to.equal(success);
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('orders');
        expect(data).to.haveOwnProperty('users');
        expect(data).to.haveOwnProperty('profit');
        done();
      });
  });
});

describe('RIDER FETCH OPEN ORDERS', () => {
  it('User login should return 200', (done) => {
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
  it('User place order should return 201', (done) => {
    chai
      .request(server)
      .post('/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send(userSample.validOrderThree)
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(message).to.equal(messages.orderPlaced);
        done();
      });
  });
  it('User place order should return 201', (done) => {
    chai
      .request(server)
      .post('/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send(userSample.validOrderThree)
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(message).to.equal(messages.orderPlaced);
        done();
      });
  });
  it('Rider login should return 200', (done) => {
    chai
      .request(server)
      .post('/auth/login')
      .send({
        identifier: 'lornemalvo@gmail.com',
        password: `${process.env.RIDER_PASSWORD_PREFIX}1111`,
      })
      .end((err, res) => {
        if (err) done(err);
        const { token } = res.body;
        expect(res.status).to.equal(success);
        expect(token);
        riderToken = token;
        expect(riderToken).to.be.a('string');
        done();
      });
  });
  it('Rider fetch open orders should return 200', (done) => {
    chai
      .request(server)
      .get('/rider/orders/open')
      .set('Authorization', `Bearer ${riderToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.ordersFound);
        expect(data);
        expect(data).to.be.a('array');
        expect(data[0].orderContents).to.be.a('array');
        expect(data[0].user).to.be.a('object');
        expect(data[0].userId).to.equal(data[0].user.id);
        expect(data[0].user).to.haveOwnProperty('id');
        expect(data[0].user).to.haveOwnProperty('firstName');
        expect(data[0].user).to.haveOwnProperty('lastName');
        expect(data[0].user).to.haveOwnProperty('phone');
        expect(data[0].user).to.haveOwnProperty('address');
        expect(data[0].orderContents[0]).to.haveOwnProperty('id');
        expect(data[0].orderContents[0]).to.haveOwnProperty('productId');
        expect(data[0].orderContents[0]).to.haveOwnProperty('productName');
        expect(data[0].orderContents[0]).to.haveOwnProperty('quantity');
        expect(data[0].orderContents[0]).to.haveOwnProperty('cost');
        expect(data[0].orderContents[0]).to.haveOwnProperty('orderId');
        expect(data[0].id).to.equal(data[0].orderContents[0].orderId);
        orderId = data[0].id;
        done();
      });
  });
  it('Rider fetch assigned orders should return 404', (done) => {
    chai
      .request(server)
      .get('/rider/orders')
      .set('Authorization', `Bearer ${riderToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(notFound);
        expect(error);
        expect(error).to.equal(messages.riderOrdersNotFound);
        done();
      });
  });
  it('Update userFcmToken in user model with test token', async () => {
    await db.sequelize.query(`UPDATE users SET "userFcmToken"='${process.env.TEST_CLIENT_FCM}'`);
  });
  it('Rider take order should return 200', (done) => {
    chai
      .request(server)
      .patch(`/rider/orders/${orderId}`)
      .set('Authorization', `Bearer ${riderToken}`)
      .send({ status: 'processing' })
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.riderUpdateOrder);
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('status');
        expect(data.status).to.equal('processing');
        done();
      });
  });
  it('Rider fetch assigned orders should return 200', (done) => {
    chai
      .request(server)
      .get('/rider/orders')
      .set('Authorization', `Bearer ${riderToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.ordersFound);
        expect(data);
        expect(data).to.be.a('array');
        expect(data[0]).to.haveOwnProperty('riderId');
        expect(data[0].riderId).to.be.a('number');
        expect(data[0].orderContents).to.be.a('array');
        expect(data[0].user).to.be.a('object');
        expect(data[0].userId).to.equal(data[0].user.id);
        expect(data[0].user).to.haveOwnProperty('id');
        expect(data[0].user).to.haveOwnProperty('firstName');
        expect(data[0].user).to.haveOwnProperty('lastName');
        expect(data[0].user).to.haveOwnProperty('phone');
        expect(data[0].user).to.haveOwnProperty('address');
        expect(data[0].orderContents[0]).to.haveOwnProperty('id');
        expect(data[0].orderContents[0]).to.haveOwnProperty('productId');
        expect(data[0].orderContents[0]).to.haveOwnProperty('productName');
        expect(data[0].orderContents[0]).to.haveOwnProperty('quantity');
        expect(data[0].orderContents[0]).to.haveOwnProperty('cost');
        expect(data[0].orderContents[0]).to.haveOwnProperty('orderId');
        done();
      });
  });
  it('Rider <on the way> should return 200', (done) => {
    chai
      .request(server)
      .patch(`/rider/orders/${orderId}`)
      .set('Authorization', `Bearer ${riderToken}`)
      .send({ status: 'ontheway' })
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.riderUpdateOrder);
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('status');
        expect(data.status).to.equal('ontheway');
        done();
      });
  });
  it('Rider <arrived> should return 200', (done) => {
    chai
      .request(server)
      .patch(`/rider/orders/${orderId}`)
      .set('Authorization', `Bearer ${riderToken}`)
      .send({ status: 'arrived' })
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.riderUpdateOrder);
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('status');
        expect(data.status).to.equal('arrived');
        done();
      });
  });
  it('Rider <arrived> should return 409', (done) => {
    chai
      .request(server)
      .patch(`/rider/orders/${orderId}`)
      .set('Authorization', `Bearer ${riderToken}`)
      .send({ status: 'arrived' })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(conflict);
        expect(error);
        expect(error).to.equal(messages.orderUpdateStatusConflict);
        done();
      });
  });
  it('Rider <completed> should return 200', (done) => {
    chai
      .request(server)
      .patch('/rider/orders/5')
      .set('Authorization', `Bearer ${riderToken}`)
      .send({ status: 'completed' })
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.riderUpdateOrder);
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('status');
        expect(data.status).to.equal('completed');
        done();
      });
  });
});

describe('USER SYNC FCM TOKEN', () => {
  it('Clear all userFcmToken in user model', async () => {
    await db.sequelize.query('UPDATE users SET "userFcmToken"=\'\'');
  });
  it('User login should return 200', (done) => {
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
  it('User sync token with empty token should return 400', (done) => {
    chai
      .request(server)
      .patch('/sync')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.userFcmTokenInvalid);
        done();
      });
  });
  it('User sync token with invalid token should return 400', (done) => {
    chai
      .request(server)
      .patch('/sync')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ userFcmToken: '' })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(messages.userFcmTokenInvalid);
        done();
      });
  });
  it('User sync token should return 200', (done) => {
    chai
      .request(server)
      .patch('/sync')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ userFcmToken: process.env.TEST_CLIENT_FCM })
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.userFcmTokenSynced);
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('id');
        expect(data).to.haveOwnProperty('userFcmToken');
        expect(data.userFcmToken).to.be.a('string');
        done();
      });
  });
});

describe('USER FETCH SINGLE ORDER', () => {
  it('User fetch unexistant single order should return 404', (done) => {
    chai
      .request(server)
      .get('/order/9999')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(notFound);
        expect(error);
        expect(error).to.equal(messages.orderNotFound);
        done();
      });
  });
  it('User fetch single order should return 200', (done) => {
    chai
      .request(server)
      .get('/order/6')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.orderFound);
        expect(data);
        expect(data).to.be.a('array');
        expect(data[0]).to.haveOwnProperty('id');
        expect(data[0]).to.haveOwnProperty('user');
        expect(data[0].user).to.be.a('object');
        expect(data[0]).to.haveOwnProperty('orderContents');
        expect(data[0].orderContents).to.be.a('array');
        expect(data[0].id).to.equal(6);
        done();
      });
  });
  it('Rider fetch single order should return 200', (done) => {
    chai
      .request(server)
      .get('/order/6')
      .set('Authorization', `Bearer ${riderToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.orderFound);
        expect(data);
        expect(data).to.be.a('array');
        expect(data[0]).to.haveOwnProperty('id');
        expect(data[0]).to.haveOwnProperty('user');
        expect(data[0].user).to.be.a('object');
        expect(data[0]).to.haveOwnProperty('orderContents');
        expect(data[0].orderContents).to.be.a('array');
        expect(data[0].id).to.equal(6);
        done();
      });
  });
  it('Admin fetch single order should return 200', (done) => {
    chai
      .request(server)
      .get('/order/5')
      .set('Authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(messages.orderFound);
        expect(data);
        expect(data).to.be.a('array');
        expect(data[0]).to.haveOwnProperty('id');
        expect(data[0]).to.haveOwnProperty('user');
        expect(data[0].user).to.be.a('object');
        expect(data[0]).to.haveOwnProperty('orderContents');
        expect(data[0].orderContents).to.be.a('array');
        expect(data[0].id).to.equal(5);
        done();
      });
  });
});
