import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userType: {
        type: String,
        required: true
    },
    userFullName: {
        type: String,
        required: true,
        unique: true
    },
    admissionId: {
        type: String,
        minlength: 3,
        maxlength: 15,
    },
    employeeId: {
        type: String,
        minlength: 3,
        maxlength: 15,
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    },
    dob: {
        type: String
    },
    address: {
        type: String,
        default: ""
    },
    mobileNumber: {
        type: Number,
        required: true
    },
    photo: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: true,
        maxlength: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    points: {
        type: Number,
        default: 0
    },
    activeTransactions: [{
        type: mongoose.Types.ObjectId,
        ref: "BookTransaction"
    }],
    prevTransactions: [{
        type: mongoose.Types.ObjectId,
        ref: "BookTransaction"
    }],
    isAdmin: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    });

export default mongoose.model("User", UserSchema);