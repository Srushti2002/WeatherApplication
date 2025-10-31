const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', async function(next) {
    const user = this;

    if(!user.isModified('password')) {
        return next();
    }  
    
    try {
        const salt = await bcrypt.genSalt(10);
        
        const hashedPassword = await bcrypt.hash(user.password, salt);

        this.password = hashedPassword;
    }
    catch(error) {
        return next(error);
    }
});

userSchema.methods.comparePassword = async function(userPwd) {
    try {
        const isMatch =  await bcrypt.compare(userPwd, this.password);
        return isMatch;
    }
    catch(error) {
        throw new Error(error);
    }
}
module.exports = mongoose.model('User', userSchema);