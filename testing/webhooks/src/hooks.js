/**
 * Webhook configuration and management
 */

import {
  generateRandomSmeeString,
  generatePolarWebhookSecret,
} from './helper.js';
import { updatePolarWebhookDestination } from './polar.js';
import { logger } from './logger.js';

/**
 * Configuration data for webhooks
 * Each entry defines an organization's webhook configuration
 */
const webhookConfigData = [
  {
    // https://docs.polar.sh/api-reference/webhooks/order.paid

    organizationId: process.env.POLAR_ORGANIZATION_ID,
    target: 'http://127.0.0.1:7100/v1/webhook/order-paid',
    events: ['order.paid'],
  },
  {
    // https://docs.polar.sh/api-reference/webhooks/subscription.revoked

    organizationId: process.env.POLAR_ORGANIZATION_ID,
    target: 'http://127.0.0.1:7100/v1/webhook/subscription-revoked',
    events: ['subscription.revoked'],
  },
];

/**
 * Validates environment variables required for webhook operation
 * @throws {Error} If required environment variables are missing
 */
const validateEnvironment = () => {
  if (!process.env.POLAR_ORGANIZATION_ACCESS_TOKEN) {
    throw new Error(
      'POLAR_ORGANIZATION_ACCESS_TOKEN environment variable is required',
    );
  }
};

/**
 * Creates a webhook configuration object with source URL generation
 * @param {string} organizationId - Polar organization ID
 * @param {string} target - Target URL for webhook forwarding
 * @param {Array} events - Array of webhook events to subscribe to
 * @returns {Object} Webhook configuration object
 */
const makeWebhookConfig = (organizationId, target, events) => {
  return {
    source: async () => {
      logger.debug('Generating webhook configuration');
      logger.debug('Organization ID:', organizationId);
      logger.debug('Target URL:', target);
      logger.debug('Events:', events);

      validateEnvironment();

      const randomKey = generateRandomSmeeString();
      const webhookSecret = generatePolarWebhookSecret();

      logger.debug('Generated random key:', randomKey);
      logger.debug(
        'Generated webhook secret (first 10 chars):',
        webhookSecret.substring(0, 10) + '...',
      );

      try {
        await updatePolarWebhookDestination(
          process.env.POLAR_ORGANIZATION_ACCESS_TOKEN,
          organizationId,
          randomKey,
          events,
          webhookSecret,
        );

        const smeeUrl = `https://smee.io/${randomKey}`;
        logger.success('Webhook source URL generated:', smeeUrl);

        return smeeUrl;
      } catch (error) {
        logger.error('Failed to configure webhook:', error.message);
        throw error;
      }
    },
    target,
  };
};

/**
 * Generate webhook configurations from the configuration data
 * Maps each webhook configuration to a webhook config object
 */
const webhookConfig = webhookConfigData.map(
  ({ organizationId, target, events }) =>
    makeWebhookConfig(organizationId, target, events),
);

export { webhookConfig };
