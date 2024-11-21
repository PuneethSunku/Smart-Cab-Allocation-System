const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://puneethkumarsunku2004:SunkU%402004@cab.zgzjy.mongodb.net/?retryWrites=true&w=majority');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
