import crypto from 'crypto';

export const getRandomCode = (length = 6) => crypto.randomUUID();
