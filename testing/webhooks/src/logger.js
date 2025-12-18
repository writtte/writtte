import chalk from 'chalk';

class Logger {
  constructor(options = {}) {
    this.showTimestamp = options.showTimestamp ?? true;
    this.showLevel = options.showLevel ?? true;
    this.prefix = options.prefix || '[SMEE]';
  }

  getTimestamp() {
    if (!this.showTimestamp) {
      return '';
    }

    return chalk.gray(`[${new Date().toISOString()}]`);
  }

  getLevelBadge(level, colorFn) {
    if (!this.showLevel) {
      return '';
    }

    return colorFn(`[${level.toUpperCase()}]`);
  }

  getPrefix() {
    return chalk.cyan(this.prefix);
  }

  formatJSON(obj) {
    if (typeof obj === 'object' && obj !== null) {
      return '\n' + JSON.stringify(obj, null, 2);
    }

    return String(obj);
  }

  log(level, colorFn, ...args) {
    const timestamp = this.getTimestamp();
    const levelBadge = this.getLevelBadge(level, colorFn);
    const prefix = this.getPrefix();

    const parts = [timestamp, levelBadge, prefix].filter(Boolean);
    const header = parts.join(' ');

    if (args.length === 0) {
      console.log(header);
      return;
    }

    if (args.length === 1) {
      const message = args[0];
      if (typeof message === 'object' && message !== null) {
        console.log(`${header} ${colorFn('JSON Data:')}`);
        console.log(colorFn(this.formatJSON(message)));
      } else {
        console.log(`${header} ${colorFn(message)}`);
      }

      return;
    }

    console.log(`${header} ${colorFn(args[0])}`);

    args.slice(1).forEach((arg) => {
      if (typeof arg === 'object' && arg !== null) {
        console.log(colorFn(this.formatJSON(arg)));
      } else {
        console.log(colorFn(`  ${arg}`));
      }
    });
  }

  info(...args) {
    this.log('info', chalk.blue, ...args);
  }

  success(...args) {
    this.log('success', chalk.green, ...args);
  }

  warn(...args) {
    this.log('warn', chalk.yellow, ...args);
  }

  error(...args) {
    this.log('error', chalk.red, ...args);
  }

  debug(...args) {
    this.log('debug', chalk.magenta, ...args);
  }

  async logHttpResponse(response, responseText) {
    const headers = Object.fromEntries([...response.headers.entries()]);

    this.info(
      `HTTP Response - Status: ${response.status} ${response.statusText}`,
    );

    this.debug('Response Headers:', headers);

    if (responseText) {
      try {
        const jsonData = JSON.parse(responseText);
        this.debug('Response Body (JSON):', jsonData);
      } catch {
        this.debug('Response Body (Text):', responseText);
      }
    }
  }

  logHttpRequest(method, url, options = {}) {
    this.info(`HTTP Request - ${method.toUpperCase()} ${url}`);

    if (options.headers) {
      this.debug('Request Headers:', options.headers);
    }

    if (options.body) {
      try {
        const bodyData = JSON.parse(options.body);
        this.debug('Request Body:', bodyData);
      } catch {
        this.debug('Request Body:', options.body);
      }
    }
  }

  logProcessSignal(signal, message) {
    this.warn(`Process Signal [${signal}]:`, message);
  }

  logServiceStatus(service, status, metadata = {}) {
    const colorFn =
      status === 'starting'
        ? chalk.blue
        : status === 'running'
          ? chalk.green
          : status === 'stopping'
            ? chalk.yellow
            : status === 'stopped'
              ? chalk.gray
              : chalk.white;

    this.log('service', colorFn, `${service} is ${status}`);

    if (Object.keys(metadata).length > 0) {
      this.debug('Service Metadata:', metadata);
    }
  }
}

const logger = new Logger();

export { Logger, logger };