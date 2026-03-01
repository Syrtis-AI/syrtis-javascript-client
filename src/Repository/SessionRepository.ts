import AbstractApiRepository from '@wexample/js-api/Common/AbstractApiRepository';
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
}
