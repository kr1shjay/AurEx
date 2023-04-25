// import package
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ApiKeySchema = new Schema({
    keyId: {
        type: String,
        unique: true,
        required: true,
        ref: 'user'
    },
    userId: {
        type: ObjectId,
        required: true,
        ref: 'user',
    },
    name: {
        type: String,
        default: 'Untitled Key'
    },
    secretKey: {
        type: String,
        unique: true,
        required: true
    },
    ipList: {
        type: Array,
        default: []
    },
    ipRestriction: {
        type: Boolean,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'Inactive'],
        default: 'active'
    },
    withdraw:{
        type:Boolean,
        default:false
    },
    deposit:{
        type:Boolean,
        default:false
    },
    trade:{
        type:Boolean,
        default:false
    },
}, {
    timestamps: true
});

const ApiKey = mongoose.model('apiKey', ApiKeySchema, 'apiKey');

export default ApiKey;