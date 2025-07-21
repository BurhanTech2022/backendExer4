import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
});


const CategoryDataBase = mongoose.model('Category',CategorySchema)

export default CategoryDataBase