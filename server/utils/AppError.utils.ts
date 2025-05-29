class ExpressError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Set the prototype explicitly to maintain proper inheritance.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default ExpressError;
