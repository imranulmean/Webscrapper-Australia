import { AldiCollection, ColesCollection, WoolsCollection } from '../models/product.model.js';
import { errorHandler } from '../utils/error.js';


export const getproducts = async (req, res, next) => {  
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 20;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const products = await ColesCollection.find({
      ...(req.query.mainCategoryName && { mainCategoryName: req.query.mainCategoryName }),
      ...(req.query.subCategoryName && { slug: req.query.subCategoryName }),
      ...(req.query.searchTerm && {
        $or: [
          { productTitle: { $regex: req.query.searchTerm, $options: 'i' } }
        ],
      }),
    }).sort({ productTitle: 1 })
      .skip(startIndex)
      .limit(limit);
    const totalProducts = await ColesCollection.countDocuments();

    res.status(200).json({
      products,
      totalProducts,
    });
  } catch (error) {
    next(error);
  }
};

