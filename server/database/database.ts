// import { Injectable } from '@nestjs/common';

// import { Sequelize } from 'sequelize-typescript';
import { Sequelize } from 'sequelize';
// import { Todo } from '../todos/entity/todo.entity';

// @Injectable()
export const databaseProviders = [
    {
        provide: 'SequelizeToken',
        useFactory: async () => {
            const sequelize = new Sequelize({
              dialect: 'postgres',
              host: process.env.DB_V1_HOST,
              port: 5432,
              username: process.env.DB_V1_USERNAME,
              password: process.env.DB_V1_PASWORD,
              database: process.env.DB_V1_DATABASE
            });
            // sequelize.addModels([__dirname + '/../**/*.entity.ts']);
            // sequelize.addModels([Todo]);
            return sequelize;
        },
    },
];
