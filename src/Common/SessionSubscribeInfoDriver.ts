import type {
  LiveUpdatesDriverConnectOptions,
  LiveUpdatesDriverInterface,
} from '@wexample/js-api/Common/LiveUpdates/LiveUpdatesDriver';
import MercureLiveUpdatesDriver from '@wexample/js-api/Common/LiveUpdates/MercureLiveUpdatesDriver';
import type SessionRepository from '../Repository/SessionRepository.js';
import type { SessionSubscribeInfo } from '../Repository/SessionRepository.js';

// Renew the JWT slightly before its announced expiration.
const EXPIRATION_MARGIN_MS = 60000;

// Driver that fetches a scoped, short-lived Mercure subscriber JWT from the
// API (session/subscribe-info/{secureId}) before each connection, caching it
// until close to expiration. Reconnections automatically pick a fresh JWT.
export default class SessionSubscribeInfoDriver implements LiveUpdatesDriverInterface {
  private cachedInfo: SessionSubscribeInfo | null = null;

  constructor(
    private readonly repository: SessionRepository,
    private readonly sessionSecureId: string
  ) {}

  async connect(options: LiveUpdatesDriverConnectOptions): Promise<EventSource> {
    const info = await this.getFreshSubscribeInfo();

    return new MercureLiveUpdatesDriver({
      hubUrl: info.hubUrl,
      jwt: info.jwt,
      // Authorization is carried by the scoped JWT in the URL, not by
      // cookies — required for hubs answering Access-Control-Allow-Origin: *.
      withCredentials: false,
    }).connect(options);
  }

  private async getFreshSubscribeInfo(): Promise<SessionSubscribeInfo> {
    if (this.cachedInfo && !this.isExpiringSoon(this.cachedInfo)) {
      return this.cachedInfo;
    }

    this.cachedInfo = await this.repository.fetchSubscribeInfo(this.sessionSecureId);

    return this.cachedInfo;
  }

  private isExpiringSoon(info: SessionSubscribeInfo): boolean {
    if (!info.expiresAt) {
      return true;
    }

    const expiresAtMs = Date.parse(info.expiresAt);
    if (Number.isNaN(expiresAtMs)) {
      return true;
    }

    return Date.now() >= expiresAtMs - EXPIRATION_MARGIN_MS;
  }
}
