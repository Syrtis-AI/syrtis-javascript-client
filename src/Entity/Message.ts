import AbstractApiEntity from '@wexample/js-api-entity/Common/AbstractApiEntity';
import schema from '../data/entity/message.json';

export default class Message extends AbstractApiEntity {
  static readonly entityName = 'message';

  // Schema-driven fields, resolved at runtime through the entity Proxy.
  declare readonly content?: string | null;
  declare readonly contentType?: string | null;
  declare readonly dateCreated?: Date | null;
  declare readonly name?: string | null;
  declare readonly origin?: string | null;
  declare readonly versionMajor?: number | null;
  declare readonly versionMinor?: number | null;

  static readonly ORIGIN_CARD = 'card';
  static readonly ORIGIN_CORE = 'core';
  static readonly ORIGIN_NODE = 'node';
  static readonly ORIGIN_USER = 'user';

  static readonly CONTENT_TYPE_ACTIONS = 'conversation/actions';
  static readonly CONTENT_TYPE_CONVERSATION_MESSAGE = 'conversation/message';
  static readonly CONTENT_TYPE_DEBUG = 'core/debug';
  static readonly CONTENT_TYPE_DOWNLOAD = 'core/download';
  static readonly CONTENT_TYPE_ERROR = 'core/error';
  static readonly CONTENT_TYPE_FORM = 'core/form';
  static readonly CONTENT_TYPE_HTTP_RESPONSE = 'core/http_response';
  static readonly CONTENT_TYPE_IMAGE = 'core/image';
  static readonly CONTENT_TYPE_INFO = 'web/info';
  static readonly CONTENT_TYPE_LIST = 'core/list';
  static readonly CONTENT_TYPE_NAVIGATE = 'core/navigate';
  static readonly CONTENT_TYPE_NAVIGATED = 'core/navigated';
  static readonly CONTENT_TYPE_PROGRESS = 'core/progress';
  static readonly CONTENT_TYPE_REFERENCE = 'core/reference';
  static readonly CONTENT_TYPE_SESSION_EXPIRE = 'core/session_expire';
  static readonly CONTENT_TYPE_SESSION_STATUS = 'core/session_status';
  static readonly CONTENT_TYPE_SUCCESS = 'web/success';
  static readonly CONTENT_TYPE_THOUGHT = 'conversation/thought';
  static readonly CONTENT_TYPE_TOOL_CALL = 'core/tool_call';
  static readonly CONTENT_TYPE_UPLOAD = 'core/upload';
  static readonly CONTENT_TYPE_URL = 'core/url';
  static readonly CONTENT_TYPE_VIDEO = 'core/video';
  static readonly CONTENT_TYPE_WARNING = 'core/warning';
  // The types of a message's shape alone: a text, a value as JSON.
  static readonly CONTENT_TYPE_TEXT = 'content/text';
  static readonly CONTENT_TYPE_MARKDOWN = 'content/markdown';
  static readonly CONTENT_TYPE_HTML = 'content/html';
  static readonly CONTENT_TYPE_YAML = 'content/yaml';
  static readonly CONTENT_TYPE_JSON = 'content/json';
  static readonly CONTENT_TYPE_OBJECT = 'content/object';

  static retrieveEntitySchema() {
    return schema;
  }

  // A "reply" is a conversational message produced by the scenario,
  // as opposed to user input or technical messages.
  static isReply(message: Message): boolean {
    return (
      message.origin === Message.ORIGIN_NODE &&
      message.contentType === Message.CONTENT_TYPE_CONVERSATION_MESSAGE
    );
  }

  // A conversational message from any origin (user input included) —
  // what a chat history typically displays.
  static isConversation(message: Message): boolean {
    return message.contentType === Message.CONTENT_TYPE_CONVERSATION_MESSAGE;
  }

  // The content as its type reads it: the server read it already
  // (`formattedContent`, a value for a type holding one); without it, the
  // content as written. Note: schema fields are read through getDataValue()
  // because the entity Proxy binds methods to the raw target.
  getParsedContent(): unknown {
    const formatted = this.getDataValue('formattedContent');
    if (formatted !== undefined) {
      return formatted;
    }

    const metadata = this.metadata;
    if (metadata && !Array.isArray(metadata)) {
      const inMetadata = (metadata as Record<string, unknown>).formattedContent;
      if (inMetadata !== undefined && inMetadata !== null) {
        return inMetadata;
      }
    }

    return this.getDataValue('content');
  }
}
