class WriteQueue {
  // Create a queue to run write operations one after another
  constructor() {
    this.queue = Promise.resolve();
  }

  // Add a new operation to the queue
  enqueue(operation) {
    this.queue = this.queue.then(async () => {
      try {
        // Run the current operation
        return await operation();
      } catch (error) {
        console.error("Queue operation failed:", error);
        throw error;
      }
    });

    return this.queue;
  }
}

// Export a single shared queue instance
const queue = new WriteQueue();

module.exports = queue;
