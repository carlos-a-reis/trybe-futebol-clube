import * as Sinon from 'sinon';
import * as chai from 'chai';
//@ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Team from '../database/models/TeamModel';

chai.use(chaiHttp);

const { expect } = chai;

const dumpTeam = { id: 1, teamName: 'Flamengo' };

const dumpTeams = [
{
    id: 1,
    teamName: 'Avaí/Kindermann'
  },
  {
    id: 2,
    teamName: 'Bahia'
  },
  {
    id: 3,
    teamName: 'Botafogo'
  },
];

describe('Testes da rota /teams', () => {
  describe('Requisição GET', () => {

    before(() => {
      Sinon.stub(Team, 'findAll').resolves(dumpTeams as Team[]);
    });

    after(() => {
      Sinon.restore();
    });

    it('Deve retornar todos os times', async () => {
      const response = await chai.request(app).get('/teams');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(dumpTeams);
    });
  });
});

describe('Testes da rota /team/:id', () => {
  describe('Requisição com id correto', () => {

    before(() => {
      Sinon.stub(Team, 'findByPk').resolves(dumpTeam as Team);
    });

    after(() => {
      Sinon.restore();
    });

    it('Deve retornar as informações do time espeífico', async () => {
      const response = await chai.request(app).get('/teams/1');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(dumpTeam);
    });
  });

  describe('Requisição com id incorreto', () => {

    before(() => {
      Sinon.stub(Team, 'findByPk').rejects();
    });

    after(() => {
      Sinon.restore();
    });

    it('Deve retornar status e mensagem de erro', async () => {
      const response = await chai.request(app).get('/teams/4');

      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({ message: 'Team not found' });
    });
  });
});