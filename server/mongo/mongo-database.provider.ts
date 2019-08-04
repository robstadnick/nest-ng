// import * as mongoose from 'mongoose';

// export const databaseProviders = [
//     // {
//     //     provide: 'DATABASE_CONNECTION',
//     //     useFactory: async (): Promise<typeof mongoose> => await mongoose.connect(``, { useNewUrlParser: true })
//     // },
//     {
//         provide: 'DATABASE_CONNECTION',
//         useFactory: async () => {
//             return mongoose.createConnection(``, { useNewUrlParser: true })
//             .then((con) => {
//                 return con;
//             })
//             .catch((err) => {
//                 console.log(err);
//                 throw new Error
//             });
//         }
//     },
// ];