import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true }, // e.g., 167
  categoryType: { type: String, enum: ['income', 'expense'], required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // FIXED
  date: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const TransactionDb = mongoose.model('Transaction', TransactionSchema);

export default TransactionDb;
