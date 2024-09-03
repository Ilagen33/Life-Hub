import crypto from 'crypto';

console.log("My Key:",  crypto.randomBytes(64).toString('hex'));
