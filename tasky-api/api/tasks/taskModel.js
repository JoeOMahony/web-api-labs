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
  updated_at: Date,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});
// The userId in the Task schema is of type Schema.Types.ObjectId, which is the MongoDB ObjectId type. 
// The ref property in userId tells Mongoose which model to use during population (i.e., when you want to fetch the associated user details for a task).



// custom validator that returns true if the deadline is greater than today’s date and time.
const dateValidator = (date) => {
  return date > new Date();
};
TaskSchema.path("deadline").validate(dateValidator);

// associates the schema instance with a database collection named ‘Task’
export default mongoose.model('Task', TaskSchema); // returns a model object, which has special methods for querying and manipulating the associated collection,
