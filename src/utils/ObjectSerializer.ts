/**
 * ObjectSerializer
 * Utility class for serializing and deserializing objects
 */

// Type for classes with fromObject static method
export interface FromObjectConstructor<T> {
  fromObject(data?: any): T;
}

/**
 * Serialize data for API transmission
 * @param data - The data to serialize
 * @returns Serialized data
 */
export function sanitizeForSerialization(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
    return data;
  }

  if (data instanceof Date) {
    return data.toISOString();
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeForSerialization(item));
  }

  if (typeof data === 'object') {
    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeForSerialization(value);
    }
    return sanitized;
  }

  return String(data);
}

/**
 * Convert value to path-safe string
 * @param value - The value to convert
 * @returns URL-encoded string
 */
export function toPathValue(value: any): string {
  return encodeURIComponent(toString(value));
}

/**
 * Convert value to string
 * @param value - The value to convert
 * @returns String representation
 */
export function toString(value: any): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  return String(value);
}

/**
 * Deserialize JSON data into objects
 * @param data - The data to deserialize
 * @param modelClass - The model class to instantiate
 * @returns Deserialized object
 */
export function deserialize<T>(
  data: any,
  modelClass?: FromObjectConstructor<T>
): T | null {
  if (data === null || data === undefined) {
    return null;
  }

  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {
      return data as T;
    }
  }

  if (modelClass && typeof modelClass.fromObject === 'function') {
    return modelClass.fromObject(data);
  }

  return data as T;
}

/**
 * ObjectSerializer class (for backward compatibility)
 */
export class ObjectSerializer {
  static sanitizeForSerialization = sanitizeForSerialization;
  static toPathValue = toPathValue;
  static toString = toString;
  static deserialize = deserialize;
}
