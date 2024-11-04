import { HttpException } from '@nestjs/common';
export declare class AlreadyEventExistsException extends HttpException {
    constructor(message?: string);
}
