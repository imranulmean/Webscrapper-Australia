import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
// Define the schema for your collection
const productSchema = new mongoose.Schema(
    {
        productTitle: String,
        productPrice: Number,
        productUrl: String,
        paginationUrl: String,
        productImage:{
          type: String,
          default:""
        }
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
    // await deleteAllData();
    // return
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
  const totalProducts = await ProductModel.countDocuments();
  console.log("totalProducts:", totalProducts);
  const regexPattern="wool";
  const res=await ProductModel.find({
    productTitle: { $regex: regexPattern, $options: 'i' } 
  });
  console.log(res)
}

const deleteAllData=async()=>{
  try {
    const res = await ProductModel.deleteMany();
    console.log(res.deletedCount, "documents deleted");
  } catch (error) {
    console.error("Error:", error);
  }
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


