const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://idankzm:idankzm2468@cluster0.purdk.mongodb.net/ecommerce';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function test() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected");
  
  const email = 'check-final-' + Date.now() + '@example.com';
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const newUser = await User.create({
    name: 'Test Final',
    email: email,
    password: hashedPassword
  });
  
  console.log("User created with password hash length:", newUser.password ? newUser.password.length : 0);
  
  const found = await User.findOne({ email });
  console.log("Verified found user has password:", !!found.password);
  
  await mongoose.disconnect();
}

test().catch(console.error);
