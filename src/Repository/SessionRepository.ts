import AbstractApiRepository from '@wexample/js-api/Common/AbstractApiRepository';
import LiveUpdatesError from '@wexample/js-api/Common/Errors/LiveUpdatesError';
import LiveUpdatesConnection, {
  type LiveUpdatesConnectionStatus,
} from '@wexample/js-api/Common/LiveUpdates/LiveUpdatesConnection';
import type SyrtisClient from '../Common/SyrtisClient.js';
import Message from '../Entity/Message.js';
import Request from '../Entity/Request.js';
import Session from '../Entity/Session.js';
import type MessageRepository from './MessageRepository.js';

export type SessionSendMessageOptions = {
  sessionSecureId: string;
  content?: string | null;
  files?: File[];
  contentType?: string;
  format?: string;
  templateId?: string | number | null;
  stamps?: string[];
  name?: string | null;
  metadata?: Record<string, unknown> | unknown[] | null;
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

export default class SessionRepository extends AbstractApiRepository<Session> {
  static getEntityType() {
    return Session;
  }

  async sendMessage(options: SessionSendMessageOptions): Promise<Message[]> {
    const {
      sessionSecureId,
      content = null,
      files = [],
      contentType = 'conversation',
      format = 'text',
      templateId = null,
      stamps = [],
      name = null,
      metadata = null,
      fileStamps = {},
      parentRequestSecureId = null,
      timeZone = null,
      sync = false,
    } = options;

    const trimmedSecureId = String(sessionSecureId || '').trim();
    if (!trimmedSecureId) {
      throw new Error('Session secureId is required.');
    }

    const trimmedContent = typeof content === 'string' ? content.trim() : '';
    if (!trimmedContent && files.length === 0) {
      throw new Error('Message content or at least one file is required.');
    }

    const messages = [];
    if (trimmedContent) {
      messages.push({
        contentType,
        format,
        templateId,
        stamps,
        content: trimmedContent,
        metadata,
        name,
      });
    }

    const data = await this.client
      .requestFormDataFromJson({
        path: this.buildPath(
          `continue/${encodeURIComponent(trimmedSecureId)}${sync ? '/sync' : ''}`
        ),
        data: {
          messages,
          fileStamps,
          parentRequestSecureId,
          timeZone: timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        files,
      })
      .json<unknown>();

    return this.hydrateMessages(data);
  }

  // Subscribes to the session live topic and dispatches hydrated entities.
  // Requires the client to be constructed with mercureHubUrl/mercureJwt
  // (or a custom liveUpdatesDriver). Returns the connection; call close()
  // when done.
  subscribe(options: SessionSubscribeOptions): LiveUpdatesConnection {
    const trimmedSecureId = String(options.sessionSecureId || '').trim();
    if (!trimmedSecureId) {
      throw new Error('Session secureId is required.');
    }

    return new LiveUpdatesConnection({
      driver: (this.client as SyrtisClient).getLiveUpdatesDriver(),
      topics: [this.buildLiveTopic(trimmedSecureId)],
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

  async fetchHistory(options: SessionFetchHistoryOptions): Promise<Message[]> {
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

    const messageRepository = this.client.getRepository(Message) as MessageRepository;
    return messageRepository.hydrateFromApiCollection(items);
  }
}
