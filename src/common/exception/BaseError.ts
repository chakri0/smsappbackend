export class BaseError extends Error {
	public errorCode: number;
	public readonly path?: string;
	constructor(errorCode: number, message: string, path?: string) {
		super(message);

		// Object.setPrototypeOf(this, new.target.prototype);
		// this.name = name;
		this.errorCode = errorCode;
		this.path = path;
		// Error.captureStackTrace(this);
	}
}
