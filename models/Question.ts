import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuestion extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  question: string;
  answer?: string;
  isAnswered: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema: Schema<IQuestion> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    question: { type: String, required: true, trim: true },
    answer: { type: String, trim: true },
    isAnswered: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Question: Model<IQuestion> =
  mongoose.models.Question || mongoose.model<IQuestion>("Question", QuestionSchema);

export default Question;
