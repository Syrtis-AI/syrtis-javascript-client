import type { ApiClientOptions } from '@wexample/js-api/Common/AbstractApiClient';
import AbstractApiEntitiesClient from '@wexample/js-api/Common/AbstractApiEntitiesClient';
import type { RepositoryClass } from '@wexample/js-api/Common/ApiEntityManager';
import getEntitySchemas from './entitySchemas.js';
import generatedRepositories from './generatedRepositories.js';

export default class SyrtisClient extends AbstractApiEntitiesClient {
  static readonly API_VERSION_2025_3 = '2025-3';
  static readonly API_VERSION_2026_1 = '2026-1';
  static readonly API_VERSION_DEFAULT = SyrtisClient.API_VERSION_2026_1;

  static readonly BASE_URL = 'https://api.syrtis.ai/api/';
  static readonly DEFAULT_BASE_URL = SyrtisClient.BASE_URL + SyrtisClient.API_VERSION_DEFAULT + '/';

  constructor(options: ApiClientOptions = {}) {
    super({
      ...options,
      baseUrl: options.baseUrl ?? SyrtisClient.DEFAULT_BASE_URL,
    });
  }

  protected getRepositoryClasses(): RepositoryClass[] {
    return generatedRepositories as RepositoryClass[];
  }

  getEntitySchemas(): Record<string, unknown> {
    return getEntitySchemas();
  }
}
