import AbstractApiRepository from '@wexample/js-api/Common/AbstractApiRepository';
import Message from '../Entity/Message.js';
import MessageRepository from './MessageRepository.js';
import Session from '../Entity/Session.js';

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

  async sendMessage(options: SessionSendMessageOptions): Promise<unknown> {
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

    return this.client
      .requestFormDataFromJson({
        path: this.buildPath(`continue/${encodeURIComponent(trimmedSecureId)}`),
        data: {
          messages,
          fileStamps,
          parentRequestSecureId,
          timeZone: timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        files,
      })
      .json<unknown>();
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
