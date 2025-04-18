export class AppError extends Error {
    public readonly statusCode: number;
    public readonly source?: string;

    constructor(message: string, statusCode: number, source?: string) {
        super(message);
        this.statusCode = statusCode;
        this.name = "AppError";
        this.source = source;
    }
}