import { describe, it, expect } from 'vitest';
import { cleanJsonResponse } from './gemini';

describe('Gemini JSON Parsing', () => {
  it('should clean standard markdown JSON blocks', () => {
    const dirty = '```json\n{"key": "value"}\n```';
    const clean = cleanJsonResponse(dirty);
    expect(clean).toBe('{"key": "value"}');
  });

  it('should clean markdown blocks without language specifier', () => {
    const dirty = '```\n{"key": "value"}\n```';
    const clean = cleanJsonResponse(dirty);
    expect(clean).toBe('{"key": "value"}');
  });

  it('should handle JSON with no markdown wrapping', () => {
    const dirty = '{"key": "value"}';
    const clean = cleanJsonResponse(dirty);
    expect(clean).toBe('{"key": "value"}');
  });

  it('should trim leading and trailing whitespace', () => {
    const dirty = '  \n\n```json\n{"key": "value"}\n```  \n';
    const clean = cleanJsonResponse(dirty);
    expect(clean).toBe('{"key": "value"}');
  });
});
