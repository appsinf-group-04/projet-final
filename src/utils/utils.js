const UserModel = require("../models/user");

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

/**
 * Get today's date formatted as dd/mm/yyyy
 * @returns {String}
 */
function getTodayFormatted() {
  const date = new Date();

  return formatDate(date);
}

function formatDate(date) {
  let day = date.getDate();
  let month = date.getMonth();
  const year = date.getFullYear();

  if (day < 10) {
    day = `0${day}`;
  }

  month += 1;

  if (month < 10) {
    month = `0${month}`;
  }

  return `${day}/${month}/${year}`;
}

/**
 * Get the next day
 * @param {Date} currentDate
 * @returns {Date}
 */
function getNextDay(currentDate) {
  const currentDateTime = new Date(currentDate);

  const nextDayDateTime = new Date(currentDateTime);
  nextDayDateTime.setDate(currentDateTime.getDate() + 1);

  return nextDayDateTime;
}

/**
 * Check if the user is authorized to perform an action on a post
 * @param {Object} user - The user object
 * @param {Object} post - The post object
 *
 * @returns {Boolean} - True if authorized, false otherwise
 */
function isUserPostOwner(user, post) {
  if (user.role === "admin") {
    return true;
  }

  return user.id === post.refUser.toString();
}


module.exports = {
  isAuthorizedEmail,
  isPhoneNumber,
  getTodayFormatted,
  formatDate,
  getNextDay,
  isUserPostOwner,
};
