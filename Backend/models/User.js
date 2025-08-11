const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // <-- NEW: Import bcryptjs

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['student', 'teacher'],
    default: 'student',
  },
  prn: {
    type: String,
    required: function() { return this.role === 'student'; },
    unique: true,
    sparse: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    required: function() { return this.role === 'student'; },
  },
}, {
  timestamps: true,
});

// --- NEW: Password Hashing Middleware ---
// This function runs right before a user document is saved to the database
userSchema.pre('save', async function (next) {
  // We only want to hash the password if it's new or has been modified
  if (!this.isModified('password')) {
    return next();
  }

  // Generate a "salt" to make the hash more secure
  const salt = await bcrypt.genSalt(10);
  // Re-assign the user's password to the new, hashed version
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- NEW: Password Comparison Method ---
// This adds a custom method to our user documents to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  // bcrypt will compare the plain-text password with the hashed one in the database
  return await bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.model('User', userSchema);

module.exports = User;