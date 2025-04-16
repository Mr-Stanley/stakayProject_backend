// testPassword.js
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/staKay-foodBank', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    const User = mongoose.model('User', new mongoose.Schema({
        username: String,
        email: String,
        password: String,
        role: String
    }));
    const user = await User.findOne({ email: 'admin@example.com' });
    if (user) {
        const isMatch = await bcrypt.compare('admin123', user.password);
        console.log('Password match:', isMatch);
    } else {
        console.log('Admin not found');
    }
    mongoose.disconnect();
}).catch(err => console.error(err));