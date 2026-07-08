import AbstractApiRepository from '@wexample/js-api/Common/AbstractApiRepository';
import LiveUpdatesError from '@wexample/js-api/Common/Errors/LiveUpdatesError';
import LiveUpdatesConnection, {
  type LiveUpdatesConnectionStatus,
} from '@wexample/js-api/Common/LiveUpdates/LiveUpdatesConnection';
import SessionSubscribeInfoDriver from '../Common/SessionSubscribeInfoDriver.js';
import type SyrtisClient from '../Common/SyrtisClient.js';
import Message from '../Entity/Message.js';
import Request from '../Entity/Request.js';
import Session from '../Entity/Session.js';
import type MessageRepository from './MessageRepository.js';

export type SessionMessagePayload = {
  content: string;
  name?: string | null;
  contentType?: string;
  format?: string;
  stamps?: string[];
  metadata?: Record<string, unknown> | unknown[] | null;
};

export type SessionSendMessageOptions = {
  sessionSecureId: string;
  // Single-message shortcut; content/name/contentType/... describe one message.
  content?: string | null;
  contentType?: string;
  format?: string;
  stamps?: string[];
  name?: string | null;
  metadata?: Record<string, unknown> | unknown[] | null;
  // Additional messages sent in the same POST (same scenario request).
  // Cumulative with the content shortcut; same per-message defaults.
  messages?: SessionMessagePayload[];
  files?: File[];
  fileStamps?: Record<string, string[]>;
  parentRequestSecureId?: string | null;
  timeZone?: string | null;
  // When true, the API waits for the whole response to be processed
  // before returning the HTTP response.
  sync?: boolean;
};

// Payload published by the API on the session Mercure topic:
// { entity_type: 'Message'|'Request', event: 'message.save'|..., data: {...} }
export type SessionLiveEvent = {
  entityType: string;
  event: string;
  data: Record<string, unknown>;
};

// Response of GET session/subscribe-info/{secureId}.
export type SessionSubscribeInfo = {
  hubUrl: string;
  jwt: string;
  topics: string[];
  expiresAt: string;
};

export type SessionSubscribeOptions = {
  sessionSecureId: string;
  onMessage?: (message: Message, liveEvent: SessionLiveEvent) => void;
  onRequest?: (request: Request, liveEvent: SessionLiveEvent) => void;
  // Called for every event, including entity types without a dedicated handler.
  onEvent?: (liveEvent: SessionLiveEvent) => void;
  onStatusChange?: (
    status: LiveUpdatesConnectionStatus,
    previousStatus: LiveUpdatesConnectionStatus
  ) => void;
};

export type SessionSendMessageAndWaitOptions = SessionSendMessageOptions & {
  timeoutMs?: number;
  // Predicate deciding which incoming message resolves the promise.
  isReply?: (message: Message) => boolean;
};

export type SessionFetchHistoryOptions = {
  sessionSecureId: string;
  page?: number;
  length?: number | null;
  lastRequestSecureId?: string | null;
  orderBy?: string | null;
  orderDirection?: 'ASC' | 'DESC' | null;
};

export type SessionCreateOptions = {
  scenarioSecureId: string;
  title?: string | null;
};

export type SessionHistory = {
  messages: Message[];
  // Null when the API did not compute it (no length requested).
  hasMore: boolean | null;
};

export default class SessionRepository extends AbstractApiRepository<Session> {
  static getEntityType() {
    return Session;
  }

  // Creates a new session on the given scenario and returns it hydrated
  // (its secureId is then used for continue/history/subscribe).
  // Input validation is the API's job — payload is sent as-is.
  async createSession(options: SessionCreateOptions): Promise<Session> {
    const data = await this.post({
      endpoint: 'create',
      payload: options,
    });

    const payload = this.extractPayload(data);

    return this.createFromApiItem(
      payload as Parameters<AbstractApiRepository<Session>['createFromApiItem']>[0]
    );
  }

  async sendMessage(options: SessionSendMessageOptions): Promise<Message[]> {
    const {
      sessionSecureId,
      content = null,
      files = [],
      contentType,
      format,
      stamps,
      name,
      metadata,
      messages = [],
      fileStamps = {},
      parentRequestSecureId = null,
      timeZone = null,
      sync = false,
    } = options;

    const messagePayloads = [];

    const trimmedContent = typeof content === 'string' ? content.trim() : '';
    if (trimmedContent) {
      messagePayloads.push(
        this.buildMessagePayload({
          content: trimmedContent,
          contentType,
          format,
          stamps,
          name,
          metadata,
        })
      );
    }

    for (const message of messages) {
      messagePayloads.push(this.buildMessagePayload(message));
    }

    const data = await this.client
      .requestFormDataFromJson({
        path: this.buildPath(
          `continue/${encodeURIComponent(sessionSecureId)}${sync ? '/sync' : ''}`
        ),
        data: {
          messages: messagePayloads,
          fileStamps,
          parentRequestSecureId,
          timeZone: timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        files,
      })
      .json<unknown>();

    return this.hydrateMessages(data);
  }

  protected buildMessagePayload(message: SessionMessagePayload) {
    return {
      content: message.content,
      contentType: message.contentType ?? Message.CONTENT_TYPE_CONVERSATION,
      format: message.format ?? Message.FORMAT_TEXT,
      stamps: message.stamps ?? [],
      metadata: message.metadata ?? null,
      name: message.name ?? null,
    };
  }

  // Fetches a scoped, short-lived Mercure subscriber JWT for this session.
  async fetchSubscribeInfo(sessionSecureId: string): Promise<SessionSubscribeInfo> {
    const data = await this.client
      .get({
        path: this.buildPath(`subscribe-info/${encodeURIComponent(sessionSecureId)}`),
      })
      .json<unknown>();

    const payload = this.extractPayload(data) as Record<string, unknown>;

    if (typeof payload.hubUrl !== 'string' || typeof payload.jwt !== 'string') {
      throw new Error('Invalid subscribe-info payload: missing "hubUrl" or "jwt".');
    }

    return {
      hubUrl: payload.hubUrl,
      jwt: payload.jwt,
      topics: Array.isArray(payload.topics) ? (payload.topics as string[]) : [],
      expiresAt: typeof payload.expiresAt === 'string' ? payload.expiresAt : '',
    };
  }

  // Subscribes to the session live topic and dispatches hydrated entities.
  // With no specific configuration, a scoped subscriber JWT is fetched from
  // the API (and renewed on reconnection); mercureHubUrl/mercureJwt or a
  // custom liveUpdatesDriver on the client take precedence. Returns the
  // connection; call close() when done.
  subscribe(options: SessionSubscribeOptions): LiveUpdatesConnection {
    const client = this.client as SyrtisClient;

    return new LiveUpdatesConnection({
      driver: client.hasLiveUpdatesDriver()
        ? client.getLiveUpdatesDriver()
        : new SessionSubscribeInfoDriver(this, options.sessionSecureId),
      topics: [this.buildLiveTopic(options.sessionSecureId)],
      onStatusChange: options.onStatusChange,
      onMessage: (payload) => {
        const liveEvent = this.parseLiveEvent(payload);
        if (!liveEvent) {
          return;
        }

        options.onEvent?.(liveEvent);

        if (liveEvent.entityType === 'Message') {
          options.onMessage?.(Message.fromApi<Message>(liveEvent.data), liveEvent);
        } else if (liveEvent.entityType === 'Request') {
          options.onRequest?.(Request.fromApi<Request>(liveEvent.data), liveEvent);
        }
      },
    });
  }

  // Sends a message without holding the HTTP response, then resolves with
  // the first live message matching isReply (default: Message.isReply).
  async sendMessageAndWaitForReply(options: SessionSendMessageAndWaitOptions): Promise<Message> {
    const { timeoutMs = 120000, isReply = Message.isReply, ...sendOptions } = options;

    return new Promise<Message>((resolve, reject) => {
      let settled = false;
      let timeoutHandle: ReturnType<typeof setTimeout> | null = null;
      let connection: LiveUpdatesConnection | null = null;

      const settle = (finish: () => void) => {
        settled = true;
        if (timeoutHandle) {
          clearTimeout(timeoutHandle);
        }
        connection?.close();
        finish();
      };

      connection = this.subscribe({
        sessionSecureId: sendOptions.sessionSecureId,
        onMessage: (message) => {
          if (!settled && isReply(message)) {
            settle(() => resolve(message));
          }
        },
      });

      timeoutHandle = setTimeout(() => {
        if (!settled) {
          settle(() =>
            reject(
              new LiveUpdatesError({
                message: `No reply received within ${timeoutMs}ms.`,
                code: 'ERR_LIVE_UPDATES_REPLY_TIMEOUT',
              })
            )
          );
        }
      }, timeoutMs);

      this.sendMessage(sendOptions).catch((error) => {
        if (!settled) {
          settle(() => reject(error));
        }
      });
    });
  }

  protected buildLiveTopic(sessionSecureId: string): string {
    return `entity/session/event/${sessionSecureId}`;
  }

  protected parseLiveEvent(payload: unknown): SessionLiveEvent | null {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return null;
    }

    const record = payload as Record<string, unknown>;
    const entityType = record.entity_type;
    const data = record.data;

    if (typeof entityType !== 'string' || !data || typeof data !== 'object') {
      return null;
    }

    return {
      entityType,
      event: typeof record.event === 'string' ? record.event : '',
      data: data as Record<string, unknown>,
    };
  }

  protected hydrateMessages(data: unknown): Message[] {
    const payload = this.extractPayload(data);
    const items = (payload as Record<string, unknown>).messages;

    if (!Array.isArray(items)) {
      throw new Error('Invalid API payload: missing "messages" array.');
    }

    const messageRepository = this.client.getRepository(Message) as MessageRepository;
    return messageRepository.hydrateFromApiCollection(items);
  }

  async fetchHistory(options: SessionFetchHistoryOptions): Promise<SessionHistory> {
    const {
      sessionSecureId,
      page = 0,
      length = 50,
      lastRequestSecureId = null,
      orderBy = null,
      orderDirection = null,
    } = options;

    const trimmedSecureId = String(sessionSecureId || '').trim();
    if (!trimmedSecureId) {
      throw new Error('Session secureId is required.');
    }

    const searchParams: Record<string, string | number> = {
      page,
    };

    if (length !== null) {
      searchParams.length = length;
    }

    if (lastRequestSecureId) {
      searchParams.lastRequestSecureId = lastRequestSecureId;
    }

    if (orderBy) {
      searchParams.orderBy = orderBy;
    }

    if (orderDirection) {
      searchParams.orderDirection = orderDirection;
    }

    const data = await this.client
      .get({
        path: this.buildPath(`history/${encodeURIComponent(trimmedSecureId)}`),
        options: { searchParams },
      })
      .json<unknown>();

    const payload = this.extractPayload(data);
    const items = this.extractItems(payload);

    const pagination = (payload as Record<string, unknown>).pagination;
    const hasMore =
      pagination &&
      typeof pagination === 'object' &&
      typeof (pagination as Record<string, unknown>).hasMore === 'boolean'
        ? ((pagination as Record<string, unknown>).hasMore as boolean)
        : null;

    const messageRepository = this.client.getRepository(Message) as MessageRepository;

    return {
      messages: messageRepository.hydrateFromApiCollection(items),
      hasMore,
    };
  }
}
