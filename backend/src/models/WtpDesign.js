import mongoose from 'mongoose';

const wtpDesignSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  flowRate: { type: Number, required: true },
  numberOfTanks: { type: Number, required: true },
  pipeDiameter: { type: Number, required: true },
  layoutType: { type: String, enum: ['compact', 'industrial'], default: 'compact' },
  metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

export default mongoose.model('WtpDesign', wtpDesignSchema);
