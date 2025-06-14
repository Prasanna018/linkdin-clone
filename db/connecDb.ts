import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGODB_URL;

if (!MONGO_URI) {
    throw new Error('please provide a mongo uri')

}

const connectDb = async () => {
    if (mongoose.connection.readyState >= 1) {
        // already connected to db
        return;


    }

    try {
        // connect to db if not
        const connected = await mongoose.connect(MONGO_URI)
        if (connected) {
            console.log('db connected!')
        }

    } catch (error) {
        console.log('error while connecting to db', error);

    }

}

export default connectDb;