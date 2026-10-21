import AbstractApiRepository from '@wexample/js-api-entity/Common/AbstractApiRepository';
import Document from '../Entity/Document.js';

export default class DocumentRepository extends AbstractApiRepository<Document> {
  static getEntityType() {
    return Document;
  }
}

