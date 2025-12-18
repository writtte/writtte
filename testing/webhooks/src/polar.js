import { logger } from './logger.js';

const POLAR_API_BASE_URL = 'https://sandbox-api.polar.sh/v1/webhooks/endpoints';

/**
 * Creates HTTP request options for Polar API calls
 * @param {string} method - HTTP method
 * @param {string} token - Polar API token
 * @param {Object} body - Request body (optional)
 * @returns {Object} Fetch request options
 */
const createRequestOptions = (method, token, body = null) => {
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  if (body) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);``
  }

  return options;
};

/**
 * Handles API response and error checking
 * @param {Response} response - Fetch response object
 * @param {string} responseText - Response text
 * @param {string} operation - Operation name for logging
 * @throws {Error} If response is not ok
 * @returns {Object} Parsed JSON response
 */
const handleApiResponse = async (response, responseText, operation) => {
  await logger.logHttpResponse(response, responseText);

  if (!response.ok) {
    logger.error(`Failed to ${operation} with status ${response.status}`);
    logger.error('Error details:', responseText);
    throw new Error(
      `${operation} failed with status ${response.status}: ${responseText}`,
    );
  }

  return JSON.parse(responseText);
};

/**
 * Lists all existing webhooks for the organization
 * @param {string} token - Polar API token
 * @returns {Promise<Array>} Array of webhook objects
 */
const listWebhooks = async (token) => {
  logger.info('Listing existing Polar webhooks');

  const options = createRequestOptions('GET', token);
  logger.logHttpRequest('GET', POLAR_API_BASE_URL, options);

  const response = await fetch(POLAR_API_BASE_URL, options);
  const responseText = await response.text();

  const result = await handleApiResponse(
    response,
    responseText,
    'list webhooks',
  );

  logger.debug('Found webhooks:', result.items.length);
  return result.items;
};

/**
 * Finds existing webhook by destination URL or organization ID
 * @param {Array} webhooks - Array of existing webhooks
 * @param {string} destination - Target destination URL
 * @param {string} organizationId - Organization ID
 * @returns {Object|null} Existing webhook or null if not found
 */
const findExistingWebhook = (webhooks, destination, organizationId) => {
  return webhooks.find(
    (webhook) =>
      webhook.url === destination || webhook.organization_id === organizationId,
  );
};

/**
 * Updates an existing webhook
 * @param {string} token - Polar API token
 * @param {Object} webhook - Existing webhook object
 * @param {string} destination - New destination URL
 * @param {Array} events - Webhook events
 * @returns {Promise<Object>} Updated webhook object
 */
const updateWebhook = async (token, webhook, destination, events) => {
  logger.info(`Updating existing webhook: ${webhook.id}`);

  const updateUrl = `${POLAR_API_BASE_URL}/${webhook.id}`;
  const body = {
    url: destination,
    secret: webhook.secret, // Keep existing secret for updates
    format: 'raw',
    events: events,
  };

  const options = createRequestOptions('PATCH', token, body);
  logger.logHttpRequest('PATCH', updateUrl, options);

  const response = await fetch(updateUrl, options);
  const responseText = await response.text();

  const result = await handleApiResponse(
    response,
    responseText,
    'update webhook',
  );

  logger.success(`Successfully updated webhook: ${webhook.id}`);
  return result;
};

/**
 * Creates a new webhook
 * @param {string} token - Polar API token
 * @param {string} destination - Destination URL
 * @param {string} organizationId - Organization ID
 * @param {Array} events - Webhook events
 * @param {string} webhookSecret - Webhook secret
 * @returns {Promise<Object>} Created webhook object
 */
const createWebhook = async (
  token,
  destination,
  organizationId,
  events,
  webhookSecret,
) => {
  logger.info('Creating new Polar webhook');

  const body = {
    url: destination,
    secret: webhookSecret,
    format: 'raw',
    events: events,
  };

  const options = createRequestOptions('POST', token, body);
  logger.logHttpRequest('POST', POLAR_API_BASE_URL, options);

  const response = await fetch(POLAR_API_BASE_URL, options);
  const responseText = await response.text();

  const result = await handleApiResponse(
    response,
    responseText,
    'create webhook',
  );

  logger.success(`Successfully created webhook: ${result.id}`);
  return result;
};

/**
 * Main function to manage Polar webhook destination
 * Handles listing, finding, updating, or creating webhooks as needed
 * @param {string} polarToken - Polar API authentication token
 * @param {string} organizationId - Organization ID for the webhook
 * @param {string} newRandomKey - Random key for Smee.io URL
 * @param {Array} events - Array of webhook events to subscribe to
 * @param {string} webhookSecret - Secret for webhook verification
 * @returns {Promise<Object>} The created or updated webhook object
 */
const updatePolarWebhookDestination = async (
  polarToken,
  organizationId,
  newRandomKey,
  events,
  webhookSecret,
) => {
  const destination = `https://smee.io/${newRandomKey}`;

  logger.info(
    `Managing Polar webhook destination for organization: ${organizationId}`,
  );

  logger.debug('New destination:', destination);
  logger.debug('Events to register:', events);

  try {
    // Step 1: List existing webhooks

    const existingWebhooks = await listWebhooks(polarToken);

    // Step 2: Check if webhook already exists

    const existingWebhook = findExistingWebhook(
      existingWebhooks,
      destination,
      organizationId,
    );

    // Step 3: Update existing or create new webhook

    if (existingWebhook) {
      return await updateWebhook(
        polarToken,
        existingWebhook,
        destination,
        events,
      );
    } else {
      return await createWebhook(
        polarToken,
        destination,
        organizationId,
        events,
        webhookSecret,
      );
    }
  } catch (error) {
    logger.error('Error managing Polar webhook destination:', error.message);
    throw error;
  }
};

export { updatePolarWebhookDestination };
