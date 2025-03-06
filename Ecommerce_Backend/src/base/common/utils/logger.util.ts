import { Logger as WinstonLogger, addColors, createLogger, format, transports } from 'winston'

import { logLevelColor, logLevelNumber, logLevelString } from '~/base/common/enums'

export class Logger {
  private readonly instance: WinstonLogger
  private readonly loggerName: string

  constructor(name: string) {
    addColors(logLevelColor)

    // định dạng lại log
    const loggerFormat = format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.printf(
        // ví dụ: [2021-07-01 10:00:00] [LoggerName] [INFO]: message
        ({ level, message, timestamp, loggerName }) => `[${timestamp}] [${loggerName}] [${level}]: ${message}`
      )
    )

    // 
    const ConsoleTransport = new transports.Console({
      format: format.combine(
        format.colorize({ all: true }), // thêm màu cho log
        loggerFormat // sử dụng định dạng trước đó
      )
    })

    const InfoLogsFileTransport = new transports.File({
      filename: 'logs/info.log', // đường dẫn đến file log
      level: logLevelString.INFO, // mức log tối thiểu
      format: loggerFormat // định dạng log
    })

    const ErrorLogsFileTransport = new transports.File({
      filename: 'logs/errors.log',
      level: logLevelString.ERROR,
      format: loggerFormat
    })

    this.loggerName = name
    // tạo logger
    this.instance = createLogger({
      format: loggerFormat,
      level: logLevelString.INFO,
      levels: logLevelNumber,
      transports: [ConsoleTransport, InfoLogsFileTransport, ErrorLogsFileTransport]
    })
  }

  public trace(msg: unknown) {
    this.instance.log(logLevelString.TRACE, this.stringify(msg), {
      loggerName: this.loggerName
    })
  }

  public debug(msg: unknown) {
    this.instance.log(logLevelString.DEBUG, this.stringify(msg), {
      loggerName: this.loggerName
    })
  }

  public info(msg: unknown) {
    this.instance.log(logLevelString.INFO, this.stringify(msg), {
      loggerName: this.loggerName
    })
  }

  public warn(msg: unknown) {
    this.instance.log(logLevelString.WARN, this.stringify(msg), {
      loggerName: this.loggerName
    })
  }

  public error(msg: unknown) {
    this.instance.log(logLevelString.ERROR, this.stringify(msg), {
      loggerName: this.loggerName
    })
  }

  public fatal(msg: unknown) {
    this.instance.log(logLevelString.FATAL, this.stringify(msg), {
      loggerName: this.loggerName
    })
    // eslint-disable-next-line no-console
    console.error('App crashed - waiting file changes before restarting...')
    process.kill(process.pid, 'SIGTERM')
  }

  //
  private stringify(value: unknown): string {
    if (value instanceof Error) {
      return `${value.stack}`
    }

    if (typeof value === 'object') {
      return JSON.stringify(value)
    }

    return `${value}`
  }
}
