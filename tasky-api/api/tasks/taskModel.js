import mongoose from 'mongoose';

// Schema is a constructor function provided by Mongoose for creating schema instances 
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  title:  {type: String,  required: true},
  description:  String ,
  deadline: Date,
  done: Boolean,
  priority: {type: String, enum: ["Low","Medium","High"], required: true},
  created_at: Date,
  updated_at: Date
});

// custom validator that returns true if the deadline is greater than today’s date and time.
const dateValidator = (date) => {
  return date > new Date();
};
TaskSchema.path("deadline").validate(dateValidator);

// associates the schema instance with a database collection named ‘Task’
export default mongoose.model('Task', TaskSchema); // returns a model object, which has special methods for querying and manipulating the associated collection,
