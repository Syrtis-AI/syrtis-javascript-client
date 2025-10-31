/**
 * Syrtis Client
 * Main entry point for the Syrtis JavaScript/TypeScript client
 */

export class SyrtisClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get the base URL of the Syrtis instance
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }
}

export default SyrtisClient;
