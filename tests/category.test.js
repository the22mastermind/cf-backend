import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';
import statusCodes from '../src/utils/statusCodes';
import messages from '../src/utils/messages';
import sample from './samples/authentication';
import db from '../src/models';

const {
  success,
  notFound,
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

describe('USER FETCH ALL CATEGORIES NOT FOUND', () => {
  beforeEach('Delete all categories', async () => {
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
