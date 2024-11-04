import { HttpException } from '@nestjs/common';
export declare class MaximumLimitReached extends HttpException {
    constructor(message?: string);
}
