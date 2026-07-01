import type { ApiClientOptions } from '@wexample/js-api/Common/AbstractApiClient';
import AbstractApiEntitiesClient from '@wexample/js-api/Common/AbstractApiEntitiesClient';
import type { RepositoryClass } from '@wexample/js-api/Common/ApiEntityManager';
import getEntitySchemas from './entitySchemas.js';
import generatedRepositories from './generatedRepositories.js';

export type SyrtisClientOptions = Omit<ApiClientOptions, 'baseUrl'> & {
  host: string;
  apiVersion?: string;
};

export default class SyrtisClient extends AbstractApiEntitiesClient {
  static readonly API_VERSION_2025_3 = '2025-3';
  static readonly API_VERSION_2026_1 = '2026-1';
  static readonly API_VERSION_DEFAULT = SyrtisClient.API_VERSION_2026_1;

  constructor(options: SyrtisClientOptions) {
    const { host, apiVersion, ...rest } = options;
    const version = apiVersion ?? SyrtisClient.API_VERSION_DEFAULT;
    const normalizedHost = host.endsWith('/') ? host : host + '/';
    super({
      ...rest,
      baseUrl: `${normalizedHost}api/${version}/`,
    });
  }

  protected getRepositoryClasses(): RepositoryClass[] {
    return generatedRepositories as RepositoryClass[];
  }

  getEntitySchemas(): Record<string, unknown> {
    return getEntitySchemas();
  }
}
