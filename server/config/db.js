const mongoose = require('mongoose');
const connectdb = async () =>{
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.mongodb_con);
        console.log(`database connected : ${conn.Connection.host}`);
    } catch (error) {
        console.log(error);
    }
}
module.exports = connectdb;