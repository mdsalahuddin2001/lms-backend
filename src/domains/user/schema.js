const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {
  baseSchema,
  baseSchemaOptions,
} = require("../../libraries/db/base-schema");

const userSchema = new mongoose.Schema(
  {
    ...baseSchema,
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      private: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
    profilePicture: String,
    bio: String,
    socialLinks: {
      google: String,
      facebook: String,
      linkedin: String,
    },
  },
  baseSchemaOptions
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

userSchema.methods.isPasswordMatch = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
