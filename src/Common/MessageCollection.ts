import type Message from '../Entity/Message.js';

type MessageRecord = Record<string, unknown>;

export type MessageCollectionAddOptions = {
  linkBranchRequests?: boolean;
  replaceExisting?: boolean;
};

export type MessageCollectionRemoveOptions = {
  unlinkBranchRequests?: boolean;
};

export default class MessageCollection {
  private readonly messagesBySecureId = new Map<string, Message>();

  constructor(messages: Message[] = []) {
    this.addMany(messages);
  }

  get size(): number {
    return this.messagesBySecureId.size;
  }

  add(message: Message, options: MessageCollectionAddOptions = {}): boolean {
    const { linkBranchRequests = false, replaceExisting = false } = options;
    const secureId = MessageCollection.getSecureId(message);

    if (!secureId) {
      return false;
    }

    if (!replaceExisting && this.messagesBySecureId.has(secureId)) {
      return false;
    }

    this.messagesBySecureId.set(secureId, message);

    if (linkBranchRequests) {
      this.linkWithPreviousRequest(message);
    }

    return true;
  }

  addMany(messages: Message[], options: MessageCollectionAddOptions = {}): number {
    let count = 0;
    for (const message of messages) {
      if (this.add(message, options)) {
        count += 1;
      }
    }

    return count;
  }

  clear(): void {
    this.messagesBySecureId.clear();
  }

  hasSecureId(secureId: string): boolean {
    return this.messagesBySecureId.has(secureId);
  }

  getBySecureId(secureId: string): Message | null {
    return this.messagesBySecureId.get(secureId) ?? null;
  }

  toArray(): Message[] {
    return Array.from(this.messagesBySecureId.values());
  }

  toSortedArray(): Message[] {
    return this.toArray().sort((left, right) => MessageCollection.compareMessages(left, right));
  }

  getLastMessage(): Message | null {
    const sorted = this.toSortedArray();
    return sorted.length > 0 ? (sorted[sorted.length - 1] ?? null) : null;
  }

  getMessagesByRequestSecureId(requestSecureId: string): Message[] {
    const matches: Message[] = [];
    for (const message of this.messagesBySecureId.values()) {
      if (MessageCollection.getRequestSecureId(message) === requestSecureId) {
        matches.push(message);
      }
    }

    return matches;
  }

  findPreviousRequestMessages(message: Message): Message[] {
    const previousRequestSecureId = MessageCollection.getPreviousRequestSecureId(message);
    if (!previousRequestSecureId) {
      return [];
    }

    return this.getMessagesByRequestSecureId(previousRequestSecureId);
  }

  isInBranch(message: Message): boolean {
    const existingMessages = this.toArray();
    if (existingMessages.length === 0) {
      return true;
    }

    const messageRequestSecureId = MessageCollection.getRequestSecureId(message);
    const previousRequestSecureId = MessageCollection.getPreviousRequestSecureId(message);

    if (!messageRequestSecureId && !previousRequestSecureId) {
      return false;
    }

    for (const existingMessage of existingMessages) {
      const existingRequestSecureId = MessageCollection.getRequestSecureId(existingMessage);
      if (!existingRequestSecureId) {
        continue;
      }

      if (
        (previousRequestSecureId && existingRequestSecureId === previousRequestSecureId) ||
        (messageRequestSecureId && existingRequestSecureId === messageRequestSecureId)
      ) {
        return true;
      }
    }

    return false;
  }

  getLastPreviousRequestMessage(message: Message): Message | null {
    const requestSecureId = MessageCollection.getRequestSecureId(message);
    if (!requestSecureId) {
      return null;
    }

    const allMessages = this.toSortedArray();
    for (let index = allMessages.length - 1; index >= 0; index -= 1) {
      const candidate = allMessages[index];
      if (!candidate) {
        continue;
      }

      if (MessageCollection.getNextRequestSecureIds(candidate).includes(requestSecureId)) {
        return candidate;
      }
    }

    return null;
  }

  hasMultipleBranches(message: Message): boolean {
    const parent = this.getLastPreviousRequestMessage(message);
    if (!parent) {
      return false;
    }

    return MessageCollection.getNextRequestSecureIds(parent).length > 1;
  }

  getCurrentBranchIndex(message: Message): number {
    const requestSecureId = MessageCollection.getRequestSecureId(message);
    if (!requestSecureId) {
      return -1;
    }

    const parent = this.getLastPreviousRequestMessage(message);
    if (!parent) {
      return -1;
    }

    return MessageCollection.getNextRequestSecureIds(parent).findIndex(
      (candidate) => candidate === requestSecureId
    );
  }

  getOtherBranchRequestSecureId(message: Message, offset: number): string | null {
    const parent = this.getLastPreviousRequestMessage(message);
    if (!parent) {
      return null;
    }

    const currentIndex = this.getCurrentBranchIndex(message);
    if (currentIndex < 0) {
      return null;
    }

    const nextRequests = MessageCollection.getNextRequestSecureIds(parent);
    return nextRequests[currentIndex + offset] ?? null;
  }

  removeByRequestSecureId(
    requestSecureId: string,
    options: MessageCollectionRemoveOptions = {}
  ): Message[] {
    const { unlinkBranchRequests = false } = options;

    for (const [secureId, message] of this.messagesBySecureId.entries()) {
      if (MessageCollection.getRequestSecureId(message) === requestSecureId) {
        this.messagesBySecureId.delete(secureId);
      }
    }

    if (unlinkBranchRequests) {
      for (const message of this.messagesBySecureId.values()) {
        const nextRequestSecureIds = MessageCollection.getNextRequestSecureIds(message);
        const index = nextRequestSecureIds.indexOf(requestSecureId);
        if (index !== -1) {
          nextRequestSecureIds.splice(index, 1);
        }
      }
    }

    return this.toSortedArray();
  }

  removeFrom(message: Message, options: MessageCollectionRemoveOptions = {}): Message[] {
    const startRequestSecureId = MessageCollection.getRequestSecureId(message);
    if (!startRequestSecureId) {
      return this.toSortedArray();
    }

    const visitedRequestSecureIds = new Set<string>();
    const queue: string[] = [startRequestSecureId];

    while (queue.length > 0) {
      const requestSecureId = queue.shift();
      if (!requestSecureId || visitedRequestSecureIds.has(requestSecureId)) {
        continue;
      }

      visitedRequestSecureIds.add(requestSecureId);
      const branchMessages = this.getMessagesByRequestSecureId(requestSecureId);
      for (const branchMessage of branchMessages) {
        queue.push(...MessageCollection.getNextRequestSecureIds(branchMessage));
      }

      this.removeByRequestSecureId(requestSecureId, options);
    }

    return this.toSortedArray();
  }

  private linkWithPreviousRequest(message: Message): void {
    const requestSecureId = MessageCollection.getRequestSecureId(message);
    if (!requestSecureId) {
      return;
    }

    const previousRequestMessages = this.findPreviousRequestMessages(message);
    for (const existingMessage of previousRequestMessages) {
      const nextRequestSecureIds = MessageCollection.getNextRequestSecureIds(existingMessage);
      if (!nextRequestSecureIds.includes(requestSecureId)) {
        nextRequestSecureIds.push(requestSecureId);
      }
    }
  }

  private static compareMessages(left: Message, right: Message): number {
    const leftId = MessageCollection.getNumericId(left);
    const rightId = MessageCollection.getNumericId(right);

    if (leftId !== null && rightId !== null) {
      return leftId - rightId;
    }

    const leftDate = MessageCollection.getDateCreatedTimestamp(left);
    const rightDate = MessageCollection.getDateCreatedTimestamp(right);
    if (leftDate !== null && rightDate !== null) {
      return leftDate - rightDate;
    }

    const leftSecureId = MessageCollection.getSecureId(left) ?? '';
    const rightSecureId = MessageCollection.getSecureId(right) ?? '';
    return leftSecureId.localeCompare(rightSecureId);
  }

  private static getNumericId(message: Message): number | null {
    const value = MessageCollection.getRecord(message)?.id;
    return typeof value === 'number' ? value : null;
  }

  private static getSecureId(message: Message): string | null {
    const value = MessageCollection.getRecord(message)?.secureId;
    return typeof value === 'string' && value.length > 0 ? value : null;
  }

  private static getRequestSecureId(message: Message): string | null {
    const messageRecord = MessageCollection.getRecord(message);
    if (!messageRecord) {
      return null;
    }

    const directValue = messageRecord.requestSecureId;
    if (typeof directValue === 'string' && directValue.length > 0) {
      return directValue;
    }

    const requestRelation = MessageCollection.getRecord(messageRecord.request);
    const relationSecureId = requestRelation?.secureId;
    return typeof relationSecureId === 'string' && relationSecureId.length > 0
      ? relationSecureId
      : null;
  }

  private static getPreviousRequestSecureId(message: Message): string | null {
    const value = MessageCollection.getRecord(message)?._previousRequestSecureId;
    return typeof value === 'string' && value.length > 0 ? value : null;
  }

  private static getNextRequestSecureIds(message: Message): string[] {
    const record = MessageCollection.getRecord(message);
    const rawValue = record?._nextRequests;
    if (Array.isArray(rawValue)) {
      if (rawValue.every((item) => typeof item === 'string' && item.length > 0)) {
        return rawValue as string[];
      }

      const sanitized = rawValue.filter(
        (item): item is string => typeof item === 'string' && item.length > 0
      );

      if (record) {
        record._nextRequests = sanitized;
      }

      return sanitized;
    }

    const nextRequests: string[] = [];
    if (record) {
      record._nextRequests = nextRequests;
    }
    return nextRequests;
  }

  private static getDateCreatedTimestamp(message: Message): number | null {
    const value = MessageCollection.getRecord(message)?.dateCreated;
    if (value instanceof Date) {
      return value.getTime();
    }

    if (typeof value === 'string') {
      const timestamp = Date.parse(value);
      return Number.isNaN(timestamp) ? null : timestamp;
    }

    return null;
  }

  private static getRecord(value: unknown): MessageRecord | null {
    return typeof value === 'object' && value !== null ? (value as MessageRecord) : null;
  }
}
