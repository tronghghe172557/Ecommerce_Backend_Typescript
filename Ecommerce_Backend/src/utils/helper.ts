import { HEADER, IHeader } from './index'
import { Request } from 'express'

/**
 * Get header value from request headers
 * @param {Request} req - Express request object
 * @param {keyof IHeader} key - Header key from IHeader interface (API_KEY | AUTHORIZATION | CLIENT_ID | REFRESH_TOKEN)
 * @returns {string} Header value as string, empty string if not found
 *
 * @example
 * // Get API key from headers
 * const apiKey = getHeader(req, 'API_KEY')
 *
 * // Get authorization token
 * const token = getHeader(req, 'AUTHORIZATION')
 *
 * // Get client ID
 * const clientId = getHeader(req, 'CLIENT_ID')
 *
 * // Get refresh token
 * const refreshToken = getHeader(req, 'REFRESH_TOKEN')
 *
 * // Check if header exists
 * if (!getHeader(req, 'API_KEY')) {
 *   throw new BadRequestResponse('API key is required')
 * }
 */
const getHeader = (req: Request, key: keyof IHeader): string => {
  const value = req.headers[HEADER[key]]
  if (!value) return ''
  return Array.isArray(value) ? value[0] : value
}

export { getHeader }
