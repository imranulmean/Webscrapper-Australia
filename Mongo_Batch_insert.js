import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
// Define the schema for your collection
const productSchema = new mongoose.Schema(
    {
        productTitle: String,
        productPrice: String,
        productUrl: String,
        paginationUrl: String,        
    },
    { timestamps: true }
);

// Define the model
const ProductModel = mongoose.model('Product', productSchema);
await mongoose.connect(process.env.MONGO);
console.log('Connected to MongoDB');
// Read JSON data from file
const aldiProducts = JSON.parse(fs.readFileSync('./AldiProducts.json', 'utf8'));
const colesProducts = JSON.parse(fs.readFileSync('./ColesProducts.json', 'utf8'));
const woolsProducts = JSON.parse(fs.readFileSync('./WoolsProducts.json', 'utf8'));

// Batch insert data into MongoDB using Mongoose
const batchInsertData = async () => {
  try {
    // Insert data
    await ProductModel.insertMany(aldiProducts);
    await ProductModel.insertMany(colesProducts);
    await ProductModel.insertMany(woolsProducts);
    
    console.log('Data import complete');
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

const queryData=async()=>{
  const totalProducts = await ProductModel.countDocuments({productUrl: { $regex: 'milk', $options: 'i' } });
  console.log("totalProducts:", totalProducts);
  const regexPattern="Woolworths";
  const res=await ProductModel.find({
    productUrl: { $regex: regexPattern, $options: 'i' } 
  });
  console.log(res)
}

const deleteData=async()=>{
  const regexPattern="Woolworths";
  try {
    const res = await ProductModel.deleteMany({
      productUrl: { $regex: regexPattern, $options: 'i' }
    });

    console.log(res.deletedCount, "documents deleted");
  } catch (error) {
    console.error("Error:", error);
  }
}
queryData();
// batchInsertData();
// deleteData();

// MONGO=mongodb+srv://imranulhasan73:rantu@cluster0.vqhondi.mongodb.net/webscarpper?retryWrites=true&w=majority
// VITE_FIREBASE_API_KEY=AIzaSyDyu3zPHWGI7Qmamx9mStYscCPY4hNgMZg
// JWT_SECRET=MERN_Blog_AUTH_SECRET
