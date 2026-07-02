import AbstractApiEntity from '@wexample/js-api/Common/AbstractApiEntity';
import schema from '../data/entity/message.json';

export default class Message extends AbstractApiEntity {
  static readonly entityName = 'message';

  // Schema-driven fields, resolved at runtime through the entity Proxy.
  declare readonly content?: string | null;
  declare readonly contentType?: string | null;
  declare readonly dateCreated?: Date | null;
  declare readonly format?: string | null;
  declare readonly name?: string | null;
  declare readonly origin?: string | null;
  declare readonly versionMajor?: number | null;
  declare readonly versionMinor?: number | null;

  static readonly ORIGIN_CARD = 'card';
  static readonly ORIGIN_CORE = 'core';
  static readonly ORIGIN_NODE = 'node';
  static readonly ORIGIN_USER = 'user';

  static readonly CONTENT_TYPE_ACTIONS = 'actions';
  static readonly CONTENT_TYPE_ANALYSIS = 'analysis';
  static readonly CONTENT_TYPE_CONVERSATION = 'conversation';
  static readonly CONTENT_TYPE_DEBUG = 'debug';
  static readonly CONTENT_TYPE_DEFAULT = 'default';
  static readonly CONTENT_TYPE_DOWNLOAD = 'download';
  static readonly CONTENT_TYPE_ERROR = 'error';
  static readonly CONTENT_TYPE_FORM = 'form';
  static readonly CONTENT_TYPE_HTTP_RESPONSE = 'http_response';
  static readonly CONTENT_TYPE_IMAGE = 'image';
  static readonly CONTENT_TYPE_INFO = 'info';
  static readonly CONTENT_TYPE_LIST = 'list';
  static readonly CONTENT_TYPE_NAVIGATE = 'navigate';
  static readonly CONTENT_TYPE_NAVIGATED = 'navigated';
  static readonly CONTENT_TYPE_PROGRESS = 'progress';
  static readonly CONTENT_TYPE_REFERENCE = 'reference';
  static readonly CONTENT_TYPE_SESSION = 'session';
  static readonly CONTENT_TYPE_SESSION_EXPIRE = 'session_expire';
  static readonly CONTENT_TYPE_SESSION_STATUS = 'session_status';
  static readonly CONTENT_TYPE_SUCCESS = 'success';
  static readonly CONTENT_TYPE_THOUGHT = 'thought';
  static readonly CONTENT_TYPE_UPLOAD = 'upload';
  static readonly CONTENT_TYPE_URL = 'url';
  static readonly CONTENT_TYPE_VIDEO = 'video';
  static readonly CONTENT_TYPE_WARNING = 'warning';

  static readonly FORMAT_BOOLEAN = 'boolean';
  static readonly FORMAT_FLOAT = 'float';
  static readonly FORMAT_HTML = 'html';
  static readonly FORMAT_INTEGER = 'integer';
  static readonly FORMAT_JSON = 'json';
  static readonly FORMAT_MARKDOWN = 'markdown';
  static readonly FORMAT_NULL = 'null';
  static readonly FORMAT_TEXT = 'text';
  static readonly FORMAT_YAML = 'yaml';

  static retrieveEntitySchema() {
    return schema;
  }

  // A "reply" is a conversational message produced by the scenario,
  // as opposed to user input or technical messages.
  static isReply(message: Message): boolean {
    return (
      message.origin === Message.ORIGIN_NODE &&
      message.contentType === Message.CONTENT_TYPE_CONVERSATION
    );
  }

  // For JSON messages, the server already parses the content into
  // metadata.formattedContent; fall back to parsing the raw content.
  // Note: schema fields are read through getDataValue() because the
  // entity Proxy binds methods to the raw target, where `this.format`
  // and friends are not resolved.
  getParsedContent(): unknown {
    const format = this.getDataValue('format');
    const content = this.getDataValue('content');

    if (format !== Message.FORMAT_JSON) {
      return content;
    }

    const metadata = this.metadata;
    if (metadata && !Array.isArray(metadata)) {
      const formatted = (metadata as Record<string, unknown>).formattedContent;
      if (formatted !== undefined && formatted !== null) {
        return formatted;
      }
    }

    if (typeof content === 'string' && content.trim() !== '') {
      return JSON.parse(content);
    }

    return null;
  }
}
