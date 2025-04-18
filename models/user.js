const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
         type: String,
          default: 'donor' 
    },

    createdAt: {
        type: Date,
        default: Date.now,
      },
    });

userSchema.pre('save', async function (next) {
        if (!this.isModified('password')) return next();
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, 10);
        next();
      });

userSchema.methods.comparePassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password);
  };

  userSchema.statics.createUser = async function ({ username, email, role = 'donor' }) {
    const user = new this({ username, email, role });
    await user.save();
    return { id: user._id, username, email, role };
  };

  userSchema.statics.findByEmail = async function (email) {
    return this.findOne({ email });
  };

  module.exports = mongoose.model('User', userSchema);