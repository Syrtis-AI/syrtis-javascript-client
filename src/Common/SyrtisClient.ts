import AbstractApiClient from "@wexample/js-api/Common/AbstractApiClient";

export default class SyrtisClient extends AbstractApiClient {
  static readonly DEFAULT_BASE_URL = 'https://api.syrtis.ai/api/';

  constructor(baseUrl: string | null = SyrtisClient.DEFAULT_BASE_URL) {
    super({ baseUrl });
  }
}
