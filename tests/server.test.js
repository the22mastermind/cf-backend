import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';
import statusCodes from '../src/utils/statusCodes';
import messages from '../src/utils/messages';

const { notFound } = statusCodes;
const { routeNotFound } = messages;

chai.use(chaiHttp);
chai.should();

describe('Server initialization', () => {
  it('Unexistant route should return 404', (done) => {
    chai
      .request(server)
      .get('/something')
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(notFound);
        expect(error);
        expect(error).to.equal(routeNotFound);
        done();
      });
  });
});
