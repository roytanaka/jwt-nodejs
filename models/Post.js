import mongoose, { mongo } from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  author: { type: mongoose.Types.ObjectId },
});

export default mongoose.model('Post', PostSchema);
