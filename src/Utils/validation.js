import mongoose from 'mongoose';

export const validateObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

export const sanitizeInput = (input) => {
    if (typeof input === 'string') {
        return input.trim().replace(/[<>]/g, '');
    }
    return input;
};

export const validateRequiredFields = (fields, body) => {
    const missing = fields.filter(field => !body[field]);
    if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
};