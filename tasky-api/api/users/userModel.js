import mongoose from 'mongoose';

/*
    Schema is a constructor function provided by Mongoose for creating schema instances (in this case, UserSchema). 
    The last line of code above associates the schema instance with a database collection named ‘User’ 
    (MongoDB creates unknown collections automatically, if necessary). 

    The model() method returns a model object, which has special methods for querying and manipulating the associated collection, 
    e.g. find(), findById(), create() etc.
*/

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

export default mongoose.model('User', UserSchema);