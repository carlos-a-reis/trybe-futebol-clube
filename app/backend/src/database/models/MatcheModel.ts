import { Model, INTEGER } from 'sequelize';
import db from '.';
import Team from './TeamModel';

class Matches extends Model {
  id!: number;
  homeTeam!: number;
  homeTeamGoals!: number;
  awayTeam!: number;
  awayTeamGoals!: number;
  inProgress!: number;
}

Matches.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  homeTeam: {
    type: INTEGER,
    references: {
      model: 'teams',
      key: 'id',
    },
  },
  homeTeamGoals: {
    type: INTEGER,
    allowNull: false,
  },
  awayTeam: {
    type: INTEGER,
    references: {
      model: 'teams',
      key: 'id',
    },
  },
  awayTeamGoals: {
    type: INTEGER,
    allowNull: false,
  },
  inProgress: {
    type: INTEGER,
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'matches',
  timestamps: false,
});

Matches.belongsTo(Team, { foreignKey: 'homeTeam', as: 'team' });
Matches.belongsTo(Team, { foreignKey: 'awayTeam', as: 'team' });

Team.hasMany(Matches, { foreignKey: 'homeTeam', as: 'matches' });
Team.hasMany(Matches, { foreignKey: 'awayTeam', as: 'matches' });

export default Matches;
