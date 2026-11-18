import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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

// These updates to the User Schema define a pre-save hook that encrypts the password property before it's saved or updated. 
UserSchema.pre('save', async function() {
  const saltRounds = 12; // You can adjust the number of salt rounds
  if (this.isModified('password') || this.isNew) {
    try {
      const hash = await bcrypt.hash(this.password, saltRounds);
      this.password = hash;
    } catch (error) {
      throw new Error(error);
    }
  } 
});

// the comparePassword() instance method can be used to authenticate users using encrypted passwords.
// This uses bcrypt to compare candidate password to the password stored in the database
UserSchema.methods.comparePassword = async function (passw) { 
    return await bcrypt.compare(passw, this.password); 
};

// static method to find a user based on their username
UserSchema.statics.findByUserName = function (username) {
  return this.findOne({ username: username });
};

export default mongoose.model('User', UserSchema);