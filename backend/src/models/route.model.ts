import mongoose, { Document, Schema } from "mongoose";

export interface IRoute extends Document {
  name: string;
  distance: number;
  geometry: {
    type: string;
    coordinates: number[][];
  };
  travelMode: string;
  user: mongoose.Schema.Types.ObjectId;
}

const RouteSchema: Schema = new Schema({
  name: { type: String, required: true },
  distance: { type: Number, required: true },
  geometry: {
    type: { type: String, required: true },
    coordinates: { type: [[Number]], required: true },
  },
  travelMode: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model<IRoute>("Route", RouteSchema);
