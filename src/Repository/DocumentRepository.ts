import AbstractApiRepository from "@wexample/js-api/Common/AbstractApiRepository";
import Document from "../Entity/Document";

export default class DocumentRepository extends AbstractApiRepository {
  static getEntityType() {
    return Document;
  }
}
