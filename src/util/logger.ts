import { createLogger, transports, format, Logger } from 'winston';
const { combine, timestamp, label, json, prettyPrint, simple } = format;

export const logger = (label: string): Logger => {
    return process.env.ENV == "prod" ? prodLogger(label) : devLogger(label);
}

const prodLogger = (labelName: string) => createLogger({
    level: "info",
    format: combine(
        simple(),
        timestamp(),
        prettyPrint({ colorize: true }),
        label({ label: labelName}),
    ),
    transports: [new transports.Console()]
})

const devLogger = (labelName: string) => createLogger({
        level: "debug",
        format: combine(
            timestamp(),
            label({ label: labelName }),
            json()
        ),
        transports: [new transports.Console()]
})
