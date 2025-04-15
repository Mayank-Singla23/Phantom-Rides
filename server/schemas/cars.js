import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    likes: {
        type: [String],
        default: [],
    },
    image: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export default mongoose.model('Car', carSchema);