import express from 'express';
import * as HttpStatus from 'http-status-codes';
import { BaseError } from '../common/exception/BaseError';
import { WinstonLogger } from '../common/logging/WinstonLogger';
export type expressErrorCd = (
	error: BaseError,
	request: express.Request,
	response: express.Response,
	next: express.NextFunction,
) => void;

export enum ErrorCode {
	Undefined,
	NotFound,
	Unauthorised,
	Forbidden,
	BadRequest,
	Conflict,
}

export class ErrorMiddleware {
	private logger: WinstonLogger;

	constructor() {
		this.logger = new WinstonLogger();
	}

	public handler(): expressErrorCd {
		return (
			error: BaseError,
			request: express.Request,
			response: express.Response,
			next: express.NextFunction,
		) => {
			const status: ErrorCode = error.errorCode;
			this.logger.error(error.message);
			this.logger.error(error.stack ?? '');
			const responseBody = {
				message: error.message || 'Something went wrong',
			};
			if (status === undefined && error.stack) {
				this.logger.error(error.stack);
			}
			const httpStatus = ErrorMiddleware.getCode(status);
			response.status(httpStatus).json(responseBody);
			if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
				next(error);
			}
		};
	}

	private static getCode(errorCode: ErrorCode): number {
		switch (errorCode) {
			case ErrorCode.Unauthorised:
				return HttpStatus.UNAUTHORIZED;
			case ErrorCode.Forbidden:
				return HttpStatus.FORBIDDEN;
			case ErrorCode.NotFound:
				return HttpStatus.NOT_FOUND;
			case ErrorCode.BadRequest:
				return HttpStatus.BAD_REQUEST;
			case ErrorCode.Conflict:
				return HttpStatus.CONFLICT;
			default:
				return HttpStatus.INTERNAL_SERVER_ERROR;
		}
	}
}

export default new ErrorMiddleware().handler();
