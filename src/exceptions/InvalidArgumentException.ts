/**
 * InvalidArgumentException
 * Exception thrown when invalid arguments are provided
 */
export class InvalidArgumentException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidArgumentException';

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidArgumentException);
    }
  }
}
