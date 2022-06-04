import { createLogger, transports, format, Logger } from 'winston';
const { combine, timestamp, label, json } = format;

export const logger = (labelName: string): Logger => {
    return createLogger({
        level: "info",
        format: combine(
            timestamp(),
            label({ label: labelName }),
            json()
        ),
        transports: [new transports.Console()]
    })
}