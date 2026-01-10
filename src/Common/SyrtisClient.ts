import AbstractApiClient, { type ApiClientOptions } from "@wexample/js-api/Common/AbstractApiClient";

export default class SyrtisClient extends AbstractApiClient {
  static readonly DEFAULT_BASE_URL = 'https://api.syrtis.ai/api/';

  constructor(options: ApiClientOptions = {}) {
    super({
      baseUrl: options.baseUrl ?? SyrtisClient.DEFAULT_BASE_URL,
    });
  }
}
