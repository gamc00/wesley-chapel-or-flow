import mongoose, { Schema, Document, Model } from 'mongoose';

// Type definitions
export type UserRole = 'Admin' | 'Standard';
export type UserStatus = 'Pending' | 'Active' | 'Disabled';
export type ProviderRole = 'Anesthesiologist' | 'CRNA' | 'AA';
export type EmploymentStatus = 'W2' | 'W4';
export type RoomType = 'OR' | 'OB' | 'ENDO' | 'CATH' | 'MRI' | 'CT';
export type CaseStatus = 'Scheduled' | 'In Room' | 'Incision' | 'Closing' | 'PACU' | 'Cancelled' | 'Delayed';
export type BoardChangeType = 'ReassignProvider' | 'MoveCase' | 'ChangeStartTime' | 'ChangeRole' | 'RoomOpenClose';
export type ChatRoomType = 'ANES_GROUP' | 'CRNA_AA_GROUP';
export type NotificationChannel = 'SMS' | 'InApp';
export type NotificationStatus = 'queued' | 'sent' | 'delivered' | 'failed' | 'skipped' | 'read';

// User interfaces
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  providerId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProvider extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  initials?: string;
  role: ProviderRole;
  active: boolean;
  availableForRelief: boolean;
  pii: {
    phone?: string;
    employmentStatus?: EmploymentStatus;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ISurgeon extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  specialty?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRoom extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  type: RoomType;
  isOpen: boolean;
}

export interface ICase extends Document {
  _id: mongoose.Types.ObjectId;
  roomId: mongoose.Types.ObjectId;
  startPlanned?: string;
  endPlanned?: string;
  surgeonId?: mongoose.Types.ObjectId;
  status: CaseStatus;
  asa?: 'I' | 'II' | 'III' | 'IV' | 'V' | 'E';
  anesthesiaType?: 'GA' | 'MAC' | 'Regional' | 'Spinal' | 'Epidural';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAssignment extends Document {
  _id: mongoose.Types.ObjectId;
  caseId: mongoose.Types.ObjectId;
  anesthesiologistId?: mongoose.Types.ObjectId;
  crnaOrAaId?: mongoose.Types.ObjectId;
  reliefCrnaId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schemas
const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Standard'], default: 'Standard' },
  status: { type: String, enum: ['Pending', 'Active', 'Disabled'], default: 'Pending' },
  providerId: { type: Schema.Types.ObjectId, ref: 'Provider' }
}, { timestamps: true });

const ProviderSchema = new Schema<IProvider>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  initials: String,
  role: { type: String, enum: ['Anesthesiologist', 'CRNA', 'AA'], required: true, index: true },
  active: { type: Boolean, default: true },
  availableForRelief: { type: Boolean, default: false },
  pii: {
    phone: String,
    employmentStatus: { type: String, enum: ['W2', 'W4'] }
  }
}, { timestamps: true });

const SurgeonSchema = new Schema<ISurgeon>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  specialty: String,
  active: { type: Boolean, default: true }
}, { timestamps: true });

const RoomSchema = new Schema<IRoom>({
  name: { type: String, required: true, unique: true },
  type: { type: String, enum: ['OR', 'OB', 'ENDO', 'CATH', 'MRI', 'CT'], required: true, index: true },
  isOpen: { type: Boolean, default: true }
});

const CaseSchema = new Schema<ICase>({
  roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true, index: true },
  startPlanned: String,
  endPlanned: String,
  surgeonId: { type: Schema.Types.ObjectId, ref: 'Surgeon' },
  status: { type: String, enum: ['Scheduled', 'In Room', 'Incision', 'Closing', 'PACU', 'Cancelled', 'Delayed'], default: 'Scheduled' },
  asa: { type: String, enum: ['I', 'II', 'III', 'IV', 'V', 'E'] },
  anesthesiaType: { type: String, enum: ['GA', 'MAC', 'Regional', 'Spinal', 'Epidural'] },
  notes: String
}, { timestamps: true });

const AssignmentSchema = new Schema<IAssignment>({
  caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true, index: true },
  anesthesiologistId: { type: Schema.Types.ObjectId, ref: 'Provider' },
  crnaOrAaId: { type: Schema.Types.ObjectId, ref: 'Provider' },
  reliefCrnaId: { type: Schema.Types.ObjectId, ref: 'Provider' }
}, { timestamps: true });

// Create indexes
UserSchema.index({ email: 1 });
ProviderSchema.index({ role: 1, active: 1 });
CaseSchema.index({ roomId: 1 });
AssignmentSchema.index({ caseId: 1 });

// Export models
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Provider: Model<IProvider> = mongoose.models.Provider || mongoose.model<IProvider>('Provider', ProviderSchema);
export const Surgeon: Model<ISurgeon> = mongoose.models.Surgeon || mongoose.model<ISurgeon>('Surgeon', SurgeonSchema);
export const Room: Model<IRoom> = mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);
export const Case: Model<ICase> = mongoose.models.Case || mongoose.model<ICase>('Case', CaseSchema);
export const Assignment: Model<IAssignment> = mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentSchema);