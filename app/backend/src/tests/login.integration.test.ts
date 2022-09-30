import * as Sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import User from '../database/models/UserModel';

chai.use(chaiHttp);

const { expect } = chai;

const dumpToken = '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW';

const dumpUserLogin = {
  email: 'admin@admin.com',
  password: 'secret_admin',
};

const dumpReturnUser = {
  id: 1,
  username: 'Admin',
  role: 'admin',
  email: 'admin@admin.com',
  password: dumpToken,
}

describe('Testes da rota /login', () => {
  describe('Requisição de login', () => {

    before(() => {
      Sinon.stub(User, 'findOne').resolves(dumpReturnUser as User);
    })

    after(() => {
      Sinon.restore();
    })

    it('Deve fazer o login com sucesso', async () => {
      const response = await chai.request(app).post('/login').send(dumpUserLogin);

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({ token: dumpToken });
    })

    it('Não deve ser possivel fazer o login sem email', async () => {
      const response = await chai.request(app).post('/login').send({
        ...dumpUserLogin,
        email: '',
      });

      expect(response.status).to.equal(400);
      expect(response.body).to.deep.equal({ message: 'All fields must be filled' });
    });

    it('Não deve ser possivel fazer o login sem password', async () => {
      const response = await chai.request(app).post('/login').send({
        ...dumpUserLogin,
        password: '',
      });

      expect(response.status).to.equal(400);
      expect(response.body).to.deep.equal({ message: 'All fields must be filled' });
    });
  })

  describe('Requisição de login com os parametros incorretas', () => {
    
    before(() => {
      Sinon.stub(User, 'findOne').resolves(null);
    })

    after(() => {
      Sinon.restore();
    })

    it('Não deve ser possivel fazer o login com email incorreto', async () => {
      const response = await chai.request(app).post('/login').send({
        ...dumpUserLogin,
        email: 'wrong@email',
      });

      expect(response.status).to.equal(401);
      expect(response.body).to.deep.equal({ message: 'Incorrect email or password' });
    });

    it('Não deve ser possivel fazer o login com password incorreto', async () => {
      const response = await chai.request(app).post('/login').send({
        ...dumpUserLogin,
        password: 'wrong@email',
      });

      expect(response.status).to.equal(401);
      expect(response.body).to.deep.equal({ message: 'Incorrect email or password' });
    });
  });
});

describe('Testes da rota /login/validate', () => {
  describe('Validação', () => {

    before(() => {
      Sinon.stub(User, 'findOne').resolves(dumpReturnUser as User);
    })

    after(() => {
      Sinon.restore();
    })

    it('Deve fazer a validação com sucesso', async () => {
      const response = await chai.request(app).get('/login/validate')
        .set('authorization', dumpToken);

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({ role: dumpReturnUser.role });
    });

    it('A validação deve falhar se o token não for passado no header', async () => {
      const response = await chai.request(app).get('/login/validate');

      expect(response.status).to.equal(401);
      expect(response.body).to.deep.equal({ message: 'Incorrect token' });
    });
  });
});
