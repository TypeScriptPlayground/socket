/**
 * This object represents all possible methods for a request.
 */
export const method = {
  GET: 'GET',
  HEAD: 'HEAD',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  CONNECT: 'CONNECT',
  OPTIONS: 'OPTIONS',
  TRACE: 'TRACE',
  PATCH: 'PATCH',
} as const;

/**
 * This type represents possible methods.
 */
// deno-lint-ignore ban-types
export type Method = typeof method[keyof typeof method] | (string & {});
