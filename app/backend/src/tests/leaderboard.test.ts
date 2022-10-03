import * as Sinon from 'sinon';
import * as chai from 'chai';
//@ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Team from '../database/models/TeamModel';
import Matches from '../database/models/MatcheModel';

chai.use(chaiHttp);

const { expect } = chai;

const dumpTeams = [
  { id: 7, teamName: 'Flamengo' },
  { id: 12, teamName: 'Palmeiras' },
];

const dumpMatches = [
  { id: 1, homeTeam:12, homeTeamGoals: 1, awayTeam: 7, awayTeamGoals: 2, inProgress: 0 },
  { id: 2, homeTeam:7, homeTeamGoals: 3, awayTeam: 12, awayTeamGoals: 0, inProgress: 0 },
];

const leaderboardHome = [
  {
    name: 'Flamengo',
    totalPoints: 3,
    totalGames: 1,
    totalVictories: 1,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 3,
    goalsOwn: 0,
    goalsBalance: 3,
    efficiency: 100,
  },
  {
    name: 'Palmeiras',
    totalPoints: 0,
    totalGames: 1,
    totalVictories: 0,
    totalDraws: 0,
    totalLosses: 1,
    goalsFavor: 1,
    goalsOwn: 2,
    goalsBalance: -1,
    efficiency: 0,
  },
];

const leaderboardAway = [
  {
    name: 'Flamengo',
    totalPoints: 3,
    totalGames: 1,
    totalVictories: 1,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 2,
    goalsOwn: 1,
    goalsBalance: 1,
    efficiency: 100,
  },
  {
    name: 'Palmeiras',
    totalPoints: 0,
    totalGames: 1,
    totalVictories: 0,
    totalDraws: 0,
    totalLosses: 1,
    goalsFavor: 0,
    goalsOwn: 3,
    goalsBalance: -3,
    efficiency: 0,
  },
];

const leaderboar = [
  {
    name: 'Flamengo',
    totalPoints: 6,
    totalGames: 2,
    totalVictories: 2,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 5,
    goalsOwn: 1,
    goalsBalance: 4,
    efficiency: 100,
  },
  {
    name: 'Palmeiras',
    totalPoints: 0,
    totalGames: 2,
    totalVictories: 0,
    totalDraws: 0,
    totalLosses: 2,
    goalsFavor: 1,
    goalsOwn: 5,
    goalsBalance: -4,
    efficiency: 0,
  },
];

describe('Teste das rotas /leaderboard', () => {
  
  before(() => {
    Sinon.stub(Team, 'findAll').resolves(dumpTeams as Team[]);
    Sinon.stub(Matches, 'findAll').resolves(dumpMatches as Matches[]);
  });

  after(() => {
    Sinon.restore();
  });

  describe('Requisição na rota /leaderboard/home', () => {
    it('Deve retornar a leaderbord ordenada pelos pontos dos times da casa', async () => {
      const response = await chai.request(app).get('/leaderboard/home');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(leaderboardHome);
    });
  });

  describe('Requisição na rota /leaderboard/away', () => {
    it('Deve retornar a leaderbord ordenada pelos pontos dos times de fora', async () => {
      const response = await chai.request(app).get('/leaderboard/away');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(leaderboardAway);
    });
  });

  describe('Requisição na rota /leaderboard', () => {
    it('Deve retornar a leaderbord ordenada pelos pontos de todos os jogos', async () => {
      const response = await chai.request(app).get('/leaderboard');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(leaderboar);
    });
  });
});