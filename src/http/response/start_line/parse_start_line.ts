import { InvalidStartLineError } from '../../error/invalid_start_line_error.ts';
import { StartLine } from './start_line.ts';

/**
 * This function parses the HTTP response, and returns the start line
 */
export function parseStartLine(content : string) : StartLine {
  const startLine = content.match(/^(?<protocol>.+) (?<code>[0-9]{3}) (?<status>.*)/)

  if (!startLine?.groups) {
    throw new InvalidStartLineError(content);
  }

  return {
    protocol: startLine.groups.protocol,
    code: parseInt(startLine.groups.code),
    status: startLine.groups.status
  }
}
