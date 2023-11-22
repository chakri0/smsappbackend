// const httpStatusCodes = require('./httpStatusCodes')
import { ErrorCode } from '../../middleware/ErrorMiddleware';
import { BaseError } from './BaseError';

export class NotFoundException extends BaseError {
	constructor(message: string, path?: string) {
		super(ErrorCode.NotFound, message, path);
	}
}
