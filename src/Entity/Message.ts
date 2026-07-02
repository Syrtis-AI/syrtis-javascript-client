import AbstractApiEntity from '@wexample/js-api/Common/AbstractApiEntity';
import schema from '../data/entity/message.json';

export default class Message extends AbstractApiEntity {
  static readonly entityName = 'message';

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
}
