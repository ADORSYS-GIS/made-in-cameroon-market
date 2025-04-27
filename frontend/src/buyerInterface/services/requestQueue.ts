/**
 * Queue API calls when offline, to replay on reconnect.
 */
export class RequestQueue {
  private queue: Request[] = [];

  enqueue(req: Request) {
    this.queue.push(req);
  }

  async replay() {
    while (this.queue.length > 0) {
      const req = this.queue.shift()!;
      await fetch(req);
    }
  }
}
