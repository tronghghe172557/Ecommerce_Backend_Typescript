export const logLevelNumber = {
  FATAL: 0, // lỗi nghiêm trọng => crash luôn hệ thống
  ERROR: 1, // lỗi ảnh hưởng đến những chức năng chính
  WARN: 2, // cảnh báo về các lỗi có thể xảy ra trong tương lai
  INFO: 3, // thông tin về quá trình hoạt động của hệ thống
  DEBUG: 4, // thông tin chi tiết về quá trình hoạt động của hệ thống
  TRACE: 5
} as const

export const logLevelString = {
  FATAL: 'FATAL',
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
  TRACE: 'TRACE'
} as const

export const logLevelColor = {
  FATAL: 'bold red',
  ERROR: 'red',
  WARN: 'yellow',
  INFO: 'blue',
  DEBUG: 'green',
  TRACE: 'grey'
} as const
