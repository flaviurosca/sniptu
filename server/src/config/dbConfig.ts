import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(
      `${process.env.MONGO_CONNECTION_STRING}`,
    );
    console.log(
      "Database connected: ",
      connect.connection.host,
      connect.connection.name,
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
