import AbstractApiRepository from '@wexample/js-api-entity/Common/AbstractApiRepository';
import Node from '../Entity/Node.js';

export default class NodeRepository extends AbstractApiRepository<Node> {
  static getEntityType() {
    return Node;
  }
}

