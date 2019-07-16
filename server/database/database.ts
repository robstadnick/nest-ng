import { Sequelize } from 'sequelize-typescript';
import { models } from './models/models'
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
            };

            const sequelize = new Sequelize(config);
            await sequelize.addModels(models);
            return sequelize;
        }
    },
];