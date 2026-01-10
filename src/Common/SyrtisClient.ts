import ApiClient from "@wexample/js-api/Common/ApiClient";

export default class SyrtisClient extends ApiClient {
  static readonly DEFAULT_BASE_URL = 'https://api.syrtis.ai/api/';

  constructor(baseUrl: string | null = SyrtisClient.DEFAULT_BASE_URL) {
    super({ baseUrl });
  }
}
