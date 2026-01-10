import AbstractApiEntity from "@wexample/js-api/Common/AbstractApiEntity";

export default class Document extends AbstractApiEntity {
  static readonly entityName = 'document';

  title?: string;

  constructor(data: Record<string, any> = {}) {
    super(data);
    this.title = data['title'];
  }
}
