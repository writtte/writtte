/**
 * Main entry point for the Smee webhook forwarder
 * Manages multiple webhook configurations and forwards events to target URLs
 */

import SmeeClient from 'smee-client';
import { webhookConfig } from './hooks.js';
import { logger } from './logger.js';

/**
 * Creates a Smee client for a webhook configuration
 * @param {Object} config - Webhook configuration object
 * @returns {SmeeClient} Configured Smee client
 */
const createSmeeClient = (config) => {
  logger.info('Starting webhook forwarding');
  logger.debug('Source:', config.source);
  logger.debug('Target:', config.target);

  return new SmeeClient({
    source: config.source,
    target: config.target,
    logger: {
      info: (...args) => logger.debug('[SmeeClient]', ...args),
      error: (...args) => logger.error('[SmeeClient]', ...args),
      log: (...args) => logger.debug('[SmeeClient]', ...args),
    },
  });
};

/**
 * Resolves all webhook configurations to get their source URLs
 * @param {Array} webhookConfigs - Array of webhook configuration objects
 * @returns {Promise<Array>} Array of resolved configurations with source URLs
 */
const resolveWebhookConfigurations = async (webhookConfigs) => {
  logger.info('Resolving webhook configurations...');

  try {
    const configsWithUrls = await Promise.all(
      webhookConfigs.map(async (config) => ({
        source: await config.source(),
        target: config.target,
      })),
    );

    logger.success(
      `Successfully resolved ${configsWithUrls.length} webhook configuration(s)`,
    );

    return configsWithUrls;
  } catch (error) {
    logger.error('Failed to resolve webhook configurations:', error.message);
    throw error;
  }
};

/**
 * Starts all webhook forwarders
 * @param {Array} configurations - Array of resolved webhook configurations
 * @returns {Array} Array of Smee client event handlers
 */
const startWebhookForwarders = (configurations) => {
  logger.info('Starting webhook forwarders...');

  const eventHandlers = configurations.map((config) => {
    const smeeClient = createSmeeClient(config);
    return smeeClient.start();
  });

  logger.success(
    `${eventHandlers.length} webhook forwarder(s) started successfully`,
  );

  return eventHandlers;
};

/**
 * Stops all webhook forwarders gracefully
 * @param {Array} eventHandlers - Array of Smee client event handlers
 */
const stopAllWebhookForwarders = (eventHandlers) => {
  logger.info('Stopping all webhook forwarders...');

  eventHandlers.forEach((handler, index) => {
    try {
      logger.debug(`Stopping webhook forwarder ${index + 1}`);
      handler.close();
    } catch (error) {
      logger.warn(
        `Failed to stop webhook forwarder ${index + 1}:`,
        error.message,
      );
    }
  });

  logger.success('All webhook forwarders stopped');
};

/**
 * Sets up graceful shutdown handlers
 * @param {Array} eventHandlers - Array of Smee client event handlers
 */
const setupGracefulShutdown = (eventHandlers) => {
  const shutdown = (signal) => {
    logger.logProcessSignal(signal, 'Shutting down webhook forwarders...');
    stopAllWebhookForwarders(eventHandlers);
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

/**
 * Main application function
 * Orchestrates the entire webhook forwarding process
 */
const main = async () => {
  try {
    logger.info('Starting Smee webhook forwarder application');

    // Step 1: Resolve all webhook configurations

    const resolvedConfigurations =
      await resolveWebhookConfigurations(webhookConfig);

    // Step 2: Start all webhook forwarders

    const eventHandlers = startWebhookForwarders(resolvedConfigurations);

    // Step 3: Setup graceful shutdown

    setupGracefulShutdown(eventHandlers);

    // Step 4: Application is now running
    logger.success('Smee webhook forwarder application is running');
    logger.info('Press Ctrl+C to stop all forwarders');
  } catch (error) {
    logger.error(
      'Failed to start webhook forwarder application:',
      error.message,
    );

    process.exit(1);
  }
};

// Start the application
main();
