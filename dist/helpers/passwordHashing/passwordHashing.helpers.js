"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordChecking = exports.hashPassword = void 0;
const bcrypt = require("bcrypt");
// converting the plain password into hash password by hashing
const hashPassword = async (password, saltRounds) => {
    return await bcrypt.hash(password, saltRounds);
};
exports.hashPassword = hashPassword;
// checking or comparing weather plainTextPassword and hashedPassword are same or not
const passwordChecking = async (plainTextPassword, hashedPassword) => {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
};
exports.passwordChecking = passwordChecking;
//# sourceMappingURL=passwordHashing.helpers.js.map