import { Model, INTEGER, STRING } from 'sequelize';
import db from '.';
import Matches from './MatcheModel';

class Teams extends Model {
  id!: number;
  teamName!: string;
}

Teams.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  teamName: {
    type: STRING(30),
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'teams',
  timestamps: false,
});

Matches.belongsTo(Teams, { foreignKey: 'homeTeam', as: 'id' });
Matches.belongsTo(Teams, { foreignKey: 'awayTeam', as: 'id' });

Teams.hasMany(Matches, { foreignKey: 'homeTeam', as: 'id' });
Teams.hasMany(Matches, { foreignKey: 'awayTeam', as: 'id' });

export default Teams;
