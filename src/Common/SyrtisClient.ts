import type { ApiClientOptions } from '@wexample/js-api/Common/AbstractApiClient';
import AbstractApiEntitiesClient from '@wexample/js-api/Common/AbstractApiEntitiesClient';
import type { RepositoryClass } from '@wexample/js-api/Common/ApiEntityManager';
import LiveUpdatesError from '@wexample/js-api/Common/Errors/LiveUpdatesError';
import type { LiveUpdatesDriverInterface } from '@wexample/js-api/Common/LiveUpdates/LiveUpdatesDriver';
import MercureLiveUpdatesDriver from '@wexample/js-api/Common/LiveUpdates/MercureLiveUpdatesDriver';
import getEntitySchemas from './entitySchemas.js';
import generatedRepositories from './generatedRepositories.js';

export type SyrtisClientOptions = Omit<ApiClientOptions, 'baseUrl'> & {
  host: string;
  apiVersion?: string;
  // Live updates (async conversations). Provide both Mercure options, or
  // inject a custom driver; when neither is set, subscribe() throws.
  mercureHubUrl?: string;
  mercureJwt?: string | null;
  liveUpdatesDriver?: LiveUpdatesDriverInterface;
};

export default class SyrtisClient extends AbstractApiEntitiesClient {
  static readonly API_VERSION_2025_3 = '2025-3';
  static readonly API_VERSION_2026_1 = '2026-1';
  static readonly API_VERSION_DEFAULT = SyrtisClient.API_VERSION_2026_1;

  private liveUpdatesDriver: LiveUpdatesDriverInterface | null;
  private readonly apiVersion: string;

  constructor(options: SyrtisClientOptions) {
    const { host, apiVersion, mercureHubUrl, mercureJwt, liveUpdatesDriver, ...rest } = options;
    const version = apiVersion ?? SyrtisClient.API_VERSION_DEFAULT;
    const normalizedHost = host.endsWith('/') ? host : host + '/';
    super({
      ...rest,
      baseUrl: `${normalizedHost}api/${version}/`,
    });

    this.apiVersion = version;
    this.liveUpdatesDriver =
      liveUpdatesDriver ??
      (mercureHubUrl
        ? new MercureLiveUpdatesDriver({
            hubUrl: mercureHubUrl,
            jwt: mercureJwt ?? null,
          })
        : null);
  }

  // Version segment of every API path — also prefixes Mercure topics
  // (2026-1/entity/session/event/{secureId}).
  getApiVersion(): string {
    return this.apiVersion;
  }

  setLiveUpdatesDriver(driver: LiveUpdatesDriverInterface): void {
    this.liveUpdatesDriver = driver;
  }

  hasLiveUpdatesDriver(): boolean {
    return this.liveUpdatesDriver !== null;
  }

  getLiveUpdatesDriver(): LiveUpdatesDriverInterface {
    if (!this.liveUpdatesDriver) {
      throw new LiveUpdatesError({
        message:
          'Live updates are not configured: pass mercureHubUrl (and mercureJwt) ' +
          'to the client constructor, or inject a liveUpdatesDriver.',
        code: 'ERR_LIVE_UPDATES_NOT_CONFIGURED',
      });
    }

    return this.liveUpdatesDriver;
  }

  protected getRepositoryClasses(): RepositoryClass[] {
    return generatedRepositories as RepositoryClass[];
  }

  getEntitySchemas(): Record<string, unknown> {
    return getEntitySchemas();
  }
}
