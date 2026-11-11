import mongoose from 'mongoose';

// Schema is a constructor function provided by Mongoose for creating schema instances 
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  title:  String,
  description:  String ,
  deadline: Date,
  done: Boolean,
  priority: {type: String, enum: ["Low","Medium","High"]},
  created_at: Date,
  updated_at: Date
});

// associates the schema instance with a database collection named ‘Task’
export default mongoose.model('Task', TaskSchema); // returns a model object, which has special methods for querying and manipulating the associated collection,
