import * as Sinon from 'sinon';
import * as chai from 'chai';
//@ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Matches from '../database/models/MatcheModel';

chai.use(chaiHttp);

const { expect } = chai;

const dumpMatch = {
  homeTeam: 1,
  awayTeam: 2,
  homeTeamGoals: 2,
  awayTeamGoals: 2,
};

const dumpMatches = [
  { ...dumpMatch, id: 1, inProgress: 1 },
  { ...dumpMatch, id: 2, inProgress: 0 },
  { ...dumpMatch, id: 3, inProgress: 1 },
];

const dumpToken = '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW';

describe('Testes da rota /matches', () => {
  describe('Requisição GET que retorna todas as partidas', () => {

    before(() => {
      Sinon.stub(Matches, 'findAll').resolves(dumpMatches as Matches[]);
    });

    after(() => {
      Sinon.restore();
    });

    it('Deve retornar todas as partidas', async () => {
      const response = await chai.request(app).get('/matches');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(dumpMatches);
    });
  });

  describe('Requisição POST de criação de partidas', () => {

    before(() => {
      Sinon.stub(Matches, 'create').resolves({
        ...dumpMatch,
        id: 1,
        inProgress: 1,
      } as Matches);
    });

    after(() => {
      Sinon.restore();
    });

    it('Deve criar uma partida com sucesso', async () => {
      const response = await chai.request(app).post('/matches').send(dumpMatch)
      .set('authorization', dumpToken);

      expect(response.status).to.equal(201);
      expect(response.body).to.deep.equal({ ...dumpMatch, id: 1, inProgress: 1 });
    });

    it('Deve retornar uma mensagem de erro se o token não for valido', async () => {
      const response = await chai.request(app).post('/matches').send(dumpMatch)
      .set('authorization', 'wrongToken');

      expect(response.status).to.equal(401);
      expect(response.body).to.deep.equal({ message: 'Token must be a valid token' });
    })
  });
});

describe('Testes da rota /matches/:id/finish', () => {
  describe('Atualiza a partida em progresso', () => {

    it('Deve atualizar partida com sucesso', async () => {
      const response = await chai.request(app).patch('/matches/1/finish');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({ message: 'Finished' });
    });
  });
});

describe('Testes da rota /matches/:id/finish', () => {
  describe('Atualiza a partida em progresso', () => {

    it('Deve atualizar partida com sucesso', async () => {
      const response = await chai.request(app).patch('/matches/1')
      .send({ hoteTeamGoals: 3, awayTeamGoals: 3 });

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({ message: 'Match updated' });
    });
  });
});