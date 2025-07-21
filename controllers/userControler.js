import { generateToken } from '../../../Lessons/PracticeLessons/AthenticationAndAuthorization/util/generateToken.js';
import userDb from  '../models/userDb.js';
import TransactionDb from '../models/transectionSchema.js';
import bcrypt from 'bcrypt';
// create a user

export const createUser = async(req, res, next) => {
  const {name, email, password, role} = req.body;
 
  const profilePicture = req.file ? req.file.filename : null;
  console.log("Profile Picture:", profilePicture);

//  hubi inu jiro user adoo adeegsanayo Email;
  const existUser = await userDb.findOne({email : email.toLowerCase()})
  if(existUser) return res.status(400).json({message : `${existUser.email} already existed`})
 try {
        // now abuur user
 const user = await userDb.create({
    name,
    email: email.toLowerCase(),
    password,
    role,
     profilePicture
 })
   const token = generateToken(user._id)
      res.status(201).json({ message: `${token}: user ${user.name.toUpperCase()} have been successfully created in the database and given 4 days login permission` })
 } catch (error) {
    next(error)
 }
}

// sign user

export const signInUser = async (req, res, next) => {
  const { email, password } = req.body;
   try {
        const user = await userDb.findOne({email:email.toLowerCase()})
        if(!user ||  !(await bcrypt.compare(password, user.password))){
          return res.status(401).json({message: "Invalid credentials 😕"})
        }
        console.log("Login info", user);
        const token = generateToken(user._id)
        res.json(token)
    } catch (error) {
        next(err)
    }
};


export const getAllUsers = async (req, res, next) => {
  try {
    // Optional: remove this check if authorize('admin') middleware is reliable
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Total number of users
    const totalUsers = await userDb.countDocuments();

    // Top 5 spending categories
    const topCategories = await TransactionDb.aggregate([
      {
        $group: {
          _id: '$category',
          totalSpent: { $sum: '$amount' }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 }
    ]);

    // Total number of transactions
    const totalTransactions = await TransactionDb.countDocuments();

    res.status(200).json({
      message: 'Admin overview data retrieved successfully',
      totalUsers,
      totalTransactions,
      topCategories
    });

  } catch (error) {
    next(error); // Use Express error handler
  }
};