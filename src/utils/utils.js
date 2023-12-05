/**
 * Check if the email is authorized to register
 * @param {String} email
 *
 * @returns {Boolean}
 *
 * @example
 * isAuthorizedEmail("allan.deroover@student.uclouvain.be"); // true
 * isAuthorizedEmail("allan.deroover@uclouvain.be"); // true
 * isAuthorizedEmail("allan.deroover@gmail.com"); // false
 */
function isAuthorizedEmail(email) {
  const domain = email.split("@")[1];

  if (domain === "student.uclouvain.be" || domain === "uclouvain.be") {
    return true;
  }

  return false;
}

/**
 * Check if the string is a phone number
 * @param {String} maybePhoneNumber
 *
 * @returns {Boolean}
 */
function isPhoneNumber(maybePhoneNumber) {
  const regex = new RegExp(
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  );

  return regex.test(maybePhoneNumber);
}

module.exports = { isAuthorizedEmail, isPhoneNumber };
