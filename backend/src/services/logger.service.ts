import { promises as fs } from 'fs';
import path from 'path';
import { AsyncLocalStorage } from 'async_hooks';
import { LoggerOptions, LogLevel } from '../../../types/loggerType';

const asyncLocalStorage = new AsyncLocalStorage<{ sessionId?: string }>();

class Logger {
    private logsDir: string;
    private logFileName: string;
    private logFilePath: string;
    private logLevels: Record<LogLevel, number>;
    private minLevel: number;

    constructor(options: LoggerOptions = {}) {
        this.logsDir = options.logsDir || './logs';
        this.logFileName = options.logFileName || 'server.log';
        this.logFilePath = path.join(this.logsDir, this.logFileName);

        this.logLevels = {
            DEBUG: 0,
            INFO: 1,
            WARN: 2,
            ERROR: 3
        };

        this.minLevel = process.env.NODE_ENV === 'production'
            ? this.logLevels.INFO
            : this.logLevels.DEBUG;

        this.initializeLogDir();
    }

    private async initializeLogDir(): Promise<void> {
        try {
            await fs.access(this.logsDir);
        } catch {
            await fs.mkdir(this.logsDir, { recursive: true });
        }
    }

    private getTime(): string {
        return new Date().toISOString();
    }

    private isError(e: unknown): e is Error {
        return e instanceof Error;
    }

    private safeStringify(obj: any): string {
        const seen = new Set();

        const replacer = (key: string, value: any) => {
            if (value && typeof value === 'object') {
                if (seen.has(value)) {
                    return '[Circular]';
                }
                seen.add(value);
            }
            return value;
        };

        return JSON.stringify(obj, replacer, 2);
    }

    private formatLogMessage(level: LogLevel, args: unknown[]): string {
        const store = asyncLocalStorage.getStore();
        const sessionId = store?.sessionId;
        const sid = sessionId ? `(sid: ${sessionId})` : '';

        const formattedArgs = args.map(arg => {
            if (typeof arg === 'string') return arg;
            if (this.isError(arg)) return `${arg.message}\n${arg.stack}`;
            return this.safeStringify(arg);
        });

        return `${this.getTime()} - ${level} - ${formattedArgs.join(' | ')} ${sid}\n`;
    }

    private async log(level: LogLevel, ...args: unknown[]): Promise<void> {
        if (this.logLevels[level] < this.minLevel) return;

        try {
            const logMessage = this.formatLogMessage(level, args);
            await fs.appendFile(this.logFilePath, logMessage, 'utf8');
        } catch (error) {
            console.error('Logging failed:', error);
        }
    }

    async debug(...args: unknown[]): Promise<void> {
        return this.log('DEBUG', ...args);
    }

    async info(...args: unknown[]): Promise<void> {
        return this.log('INFO', ...args);
    }

    async warn(...args: unknown[]): Promise<void> {
        return this.log('WARN', ...args);
    }

    async error(...args: unknown[]): Promise<void> {
        return this.log('ERROR', ...args);
    }
}

const logger = new Logger();
export default logger;
