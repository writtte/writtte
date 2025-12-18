/**
 * Utility functions for webhook management
 */

/**
 * Generates a random alphanumeric string for Smee channel identification
 * @param {number} length - The length of the string to generate (default: 15)
 * @returns {string} A random alphanumeric string
 */
const generateRandomSmeeString = (length = 15) => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }

  return result;
};

/**
 * Generates a secure webhook secret following Standard Webhooks specification
 * Polar webhook secrets typically start with 'polar_whs_' prefix
 * @returns {string} A secure webhook secret with proper prefix
 */
const generatePolarWebhookSecret = () => {
  const prefix = 'polar_whs_';
  const secretLength = 40;
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let secret = '';
  for (let i = 0; i < secretLength; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    secret += chars[randomIndex];
  }

  return prefix + secret;
};

export { generateRandomSmeeString, generatePolarWebhookSecret };