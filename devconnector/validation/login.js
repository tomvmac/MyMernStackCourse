const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data){
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email: '';
    data.password = !isEmpty(data.password) ? data.password: '';


    // Email Validation
    if (Validator.isEmpty(data.email)){
        errors.email = 'Email field is required';
    } else {
        if (!Validator.isEmail(data.email)){
            errors.email = 'Email is invalid';
        }
    }

    // Password Validation
    if (Validator.isEmpty(data.password)){
        errors.password = 'Password field is required';
    } else {
        if (!Validator.isLength(data.password, {min: 6, max: 30})){
            errors.password = 'Password field must be at least 6 characters';
        }
    }

    return {
        errors: errors,
        isValid: isEmpty(errors)

    };
};