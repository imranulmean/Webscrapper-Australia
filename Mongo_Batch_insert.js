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
        },
        shop:{
          type:String,
          default:""
        }
    },
    { timestamps: true }
);

// Define the model
// const ProductModel = mongoose.model('AllProduct', productSchema);
const AldiCollection = mongoose.model('AldiProduct', productSchema);
const ColesCollection = mongoose.model('ColesProduct', productSchema);
const WoolsCollection = mongoose.model('WoolsProduct', productSchema);
await mongoose.connect(process.env.MONGO);
console.log('Connected to MongoDB');
// Read JSON data from file
const aldiProducts = JSON.parse(fs.readFileSync('./AldiProducts.json', 'utf8'));
const colesProducts = JSON.parse(fs.readFileSync('./ColesProducts.json', 'utf8'));
const woolsProducts = JSON.parse(fs.readFileSync('./WoolsProducts.json', 'utf8'));

const batchInsertData = async () => {
  try {
    // Insert data
    // await deleteAllData();
    // return
    await AldiCollection.insertMany(aldiProducts);
    // await ColesCollection.insertMany(colesProducts);
    // await WoolsCollection.insertMany(woolsProducts);
    
    console.log('Data import complete');
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

const queryData=async()=>{

  const regexPattern="egg";
  // const totalProducts = await AldiCollection.countDocuments({productTitle: { $regex: regexPattern, $options: 'i' }});
  // console.log("totalProducts:", totalProducts);
  const aldiRes=await AldiCollection.find({
    productTitle: { $regex: regexPattern, $options: 'i' } 
  });
  console.log("aldiRes:",aldiRes) 
  const colesRes=await ColesCollection.find({
    productTitle: { $regex: regexPattern, $options: 'i' } 
  });
  console.log("Coles Res:",colesRes)
  const woolRes=await WoolsCollection.find({
    productTitle: { $regex: regexPattern, $options: 'i' } 
  });    
  console.log("Wool Res:",woolRes)
  
}

const removeDuplicate= async()=>{  
  const distinctProductUrls = await AldiCollection.distinct('productUrl');
  console.log("uniqueDocuments:", distinctProductUrls);
  for (const productUrl of distinctProductUrls) {
    const result = await AldiCollection.findOne({ productUrl });
    if (result) {
      console.log(`Document kept for productUrl: ${productUrl}`);
    } else {
      console.log(`No document found for productUrl: ${productUrl}`);
    }
    await AldiCollection.deleteMany({ productUrl, _id: { $ne: result._id } });
  }
  consol.log("Duplicate Data Delete Complete");
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

const batchUpdate= async () =>{
  await AldiCollection.updateMany(
    {
      $set:{
        shop:"Aldi"
      },
    }
  );
  await ColesCollection.updateMany(
    {
      $set:{
        shop:"Coles"
      },
    }
  );
  await WoolsCollection.updateMany(
    {
      $set:{
        shop:"Wools"
      },
    }
  );    
  console.log("Product Update Successfully")
}
//  queryData();
batchInsertData();
// batchUpdate();
// deleteData();
// deleteAllData();


// { "productTitle": { $regex: "(egg|eggs).*12\\s*|12\\s*.*(egg|eggs)", $options: 'i' } }