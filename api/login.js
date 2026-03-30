import mongoose from "mongoose";
import bcrypt from "bcrypt";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
};

const UserSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.json("Wrong password");

  res.json("Login successful");
}