import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';
import User from '../models/user.model.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, 'Unauthorized'));
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return next(errorHandler(401, 'Unauthorized'));
    }
    const validUser= await User.findById({_id:user.id});
    if(!validUser){
      return next(errorHandler(401, 'Unauthorized'));
    }
    req.user = user;
    next();
  });
};
