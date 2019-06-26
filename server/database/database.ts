import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { UserRoles } from './models/users/user.roles.model';
import { User } from './models/users/user.model';
// import { databaseConfig } from './config/database.config';

export const databaseProvider = [
    {
        provide: 'SequelizeInstance',
        useFactory: async () => {
            let config;
            config = {
                dialect: 'postgres',
                database: process.env.DB_DATABASE,
                dialectOptions: {
                    ssl: true
                },
                operatorsAliases: Op,
                replication: {
                    read: [
                        {
                            username: process.env.DB_USER,
                            password: process.env.DB_PASSWORD,
                            host: process.env.DB_HOST_READ,
                        },
                    ],
                    write: {
                        username: process.env.DB_USER,
                        password: process.env.DB_PASSWORD,
                        host: process.env.DB_HOST,
                    }
                },
                pool: {
                    max: 20,
                    min: 0,
                    idle: 10000,
                    acquire: 50000,
                    handleDisconnects: true,
                    evict: 60000,
                    connectRetries: 5,
                },
                // models: [
                //     __dirname + './models/**/*.model.ts',
                //     __dirname + './models/*.model.ts',
                // ]
            };
            // console.log(process.env.NODE_ENV);
            // switch (process.env.NODE_ENV) {
            //     case 'prod':
            //     case 'production':
            //         config = databaseConfig.production;
            //     case 'dev':
            //     case 'development':
            //         config = databaseConfig.development;
            //     default:
            //         config = databaseConfig.development;
            // }

            const sequelize = new Sequelize(config);
            await sequelize.addModels([
                User,
                UserRoles,
            ])
            sequelize.authenticate()
                .then(() => {
                    console.log('Database Connection has been established successfully.');
                })
                .catch(err => {
                    console.error('Unable to connect to the database:', err);
                });
            // const models = {
            //     UserAgency: sequelize.import('../../server/database/models/users/agency.model.js'),
            //     // User: sequelize.import('./models/user/user.js'),
            //     // UserLite: sequelize.import('./models/user/user.lite.js'),
            // }
            // Object.keys(models).forEach(function (modelName) {
            //     //console.log('models: ', models)
            //     if (models[modelName].associate) {
            //         models[modelName].associate(models);
            //     }
            // });
            // sequelize.models
            /* await sequelize.sync(); add this if you want to sync model and DB.*/
            return sequelize;
        }
    },
];