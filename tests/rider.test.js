import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';
import statusCodes from '../src/utils/statusCodes';
import messages from '../src/utils/messages';

const {
  success,
  notFound,
  unauthorized,
} = statusCodes;
const baseUrl = '/rider';

chai.use(chaiHttp);
chai.should();

let userToken = null;

describe('RIDER FETCH EMPTY OPEN ORDERS', () => {
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
  it('User fetch open orders should return 401', (done) => {
    chai
      .request(server)
      .get(`${baseUrl}/orders/open`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(unauthorized);
        expect(error);
        expect(error).to.equal(messages.userNotRider);
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
        userToken = token;
        expect(userToken).to.be.a('string');
        done();
      });
  });
  it('Rider fetch empty open orders should return 404', (done) => {
    chai
      .request(server)
      .get(`${baseUrl}/orders/open`)
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
