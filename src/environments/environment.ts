import { Environment } from './environment.interface';

export const environment: Environment = {
    production: false,
    // API_BASE: `http://localhost:7001`/`,
    API_BASE: `https://localhost:7271/`,
    MAX_IDLE_TIMEOUT_IN_MS: 120 * 1000 * 60
};
