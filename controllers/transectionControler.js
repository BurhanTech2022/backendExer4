import TransactionDb from '../models/transectionSchema.js';
import CategoryDb from '../models/categoryDb.js';
export const createTransaction = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'You must be logged in to create a transaction.' });
    }

    const { title, amount, category, categoryType, date } = req.body;

    // Validate categoryType
    const validTypes = ['income', 'expense'];
    if (!validTypes.includes(categoryType)) {
      return res.status(400).json({ message: 'categoryType must be either "income" or "expense".' });
    }

    // Check if category exists
    let existingCategory = await CategoryDb.findOne({
      name: category,
      type: categoryType,
      createdBy: req.user._id
    });

    // Create new category if it doesn't exist
    if (!existingCategory) {
      existingCategory = await CategoryDb.create({
        name: category,
        type: categoryType,
        createdBy: req.user._id
      });
    }

    // Create the transaction
    const newTransaction = await TransactionDb.create({
      title,
      amount: Number(amount), 
      categoryType,
      category: existingCategory._id,
      date,
      createdBy: req.user._id
    });

    res.status(201).json({ message: 'Transaction created successfully', transaction: newTransaction });
  } catch (error) {
    next(error);
  }
};

// get transection by createdBy
export const getTransactions = async (req, res,next) => {
  try {
    const transactions = await TransactionDb.find({ createdBy: req.user._id })
      .populate('category') 
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    // res.status(500).json({ success: false, message: error.message });
    next(error)
  }
};

// get monthly summary by groub by Category:
// GET /transactions/monthly-summary
export const getMonthlySummary = async (req, res,next) => {
  try {
    const userId = req.user._id;

    const summary = await TransactionDb.aggregate([
      // Match only user's transactions
      {
        $match: {
          createdBy: userId
        }
      },
      // Lookup category details
      {
        $lookup: {
          from: 'categories', // This should match the collection name in MongoDB
          localField: 'category',
          foreignField: '_id',
          as: 'categoryDetails'
        }
      },
      {
        $unwind: '$categoryDetails'
      },
    
      {
        $addFields: {
          year: { $year: '$date' },
          month: { $month: '$date' }
        }
      },
      // Group by year, month, and category
      {
        $group: {
          _id: {
            year: '$year',
            month: '$month',
            category: '$categoryDetails.name',
            type: '$categoryType'
          },
          totalAmount: { $sum: '$amount' }
        }
      },
      {
        $sort: {
          '_id.year': -1,
          '_id.month': -1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      summary
    });

  } catch (error) {
    next(error)
  }
};


// update transection

export const updateTransection = async (req, res, next) => {
  try {
    const transactionId = req.params.id;
    const userId = req.user._id;


    const { category, categoryType, ...updateFields } = req.body;

    // 2. Handle category lookup/creation
    if (category && categoryType) {
      let existingCategory = await CategoryDb.findOne({
        name: category,
        type: categoryType,
        createdBy: userId
      });

      updateFields.category = existingCategory._id;
    }

    // 3. Perform update
    const updatedTransaction = await TransactionDb.findOneAndUpdate(
      { _id: transactionId, createdBy: userId },
      updateFields,
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found. Make sure the ID is correct and it belongs to the logged-in user.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transaction successfully updated',
      transaction: updatedTransaction
    });

  } catch (error) {
    console.error("Update Error:", error);
    next(error);
  }
};

// dete transection

export const deleteTransection = async (req, res, next) => {
  try {
    const deletedTransaction = await TransactionDb.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!deletedTransaction) {
      return res.status(404).json({ message: 'No transaction found for this ID or unauthorized' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    next(error);
  }
};
