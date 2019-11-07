const genPass = require('password-generator');
const valPass = require('password-validator');

// PASSWORD GENERATOR
const maxLength = 15;
const minLength = 9;
const uppercaseCount = 1;
const lowercaseCount = 1;
const numberCount = 1;
const specialCount = 1;

var UPPERCASE_REGEX = /([A-Z])/g;
var LOWERCASE_REGEX = /([a-z])/g;
var NUMBER_REGEX = /([\d])/g;
var SPECIAL_CHAR_REGEX = /([\?\-])/g;
var NON_REPEATING_CHAR_REGEX = /([\w\d\?\-])\1{2,}/g;

function isStrongEnough(password) {
    var uc = password.match(UPPERCASE_REGEX);
    var lc = password.match(LOWERCASE_REGEX);
    var n = password.match(NUMBER_REGEX);
    var sc = password.match(SPECIAL_CHAR_REGEX);
    var nr = password.match(NON_REPEATING_CHAR_REGEX);
    return password.length >= minLength &&
        !nr &&
        uc && uc.length >= uppercaseCount &&
        lc && lc.length >= lowercaseCount &&
        n && n.length >= numberCount &&
        sc && sc.length >= specialCount;
}

function customPassword() {
    var password = "";
    var randomLength = Math.floor(Math.random() * (maxLength - minLength)) + minLength;
    while (!isStrongEnough(password)) {
        password = genPass(randomLength, false, /[\w\d\?\-]/);
    }
    return password;
}

// PASSWORD VALIDATOR
var schema = new valPass();

schema 
    .is().min(9)
    .is().max(15) 
    .has().uppercase() 
    .has().lowercase()
    .has().digits()
    .has().symbols()
    .has().not().spaces();

// schema.validate('P@ssw0rd');