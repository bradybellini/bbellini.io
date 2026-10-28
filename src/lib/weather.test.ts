import { describe, expect, test } from 'bun:test';
import { forecastUrl, geocodeUrl, readCoordinates, readTemperature } from './weather';

describe('request URLs', () => {
  test('geocodes the ZIP as a US postal code, one match', () => {
    const url = new URL(geocodeUrl('10001'));
    expect(url.origin).toBe('https://geocoding-api.open-meteo.com');
    expect(url.searchParams.get('name')).toBe('10001');
    expect(url.searchParams.get('countryCode')).toBe('US');
    expect(url.searchParams.get('count')).toBe('1');
  });

  test('escapes what the user typed', () => {
    expect(new URL(geocodeUrl('a&b=c')).searchParams.get('name')).toBe('a&b=c');
  });

  test('asks for the current temperature in Fahrenheit', () => {
    const url = new URL(forecastUrl(40.71, -74.01));
    expect(url.origin).toBe('https://api.open-meteo.com');
    expect(url.searchParams.get('latitude')).toBe('40.71');
    expect(url.searchParams.get('longitude')).toBe('-74.01');
    expect(url.searchParams.get('current')).toBe('temperature_2m');
    expect(url.searchParams.get('temperature_unit')).toBe('fahrenheit');
  });
});

describe('readCoordinates', () => {
  test('takes the first match', () => {
    const json = { results: [{ name: 'New York', latitude: 40.71, longitude: -74.01 }, { latitude: 0, longitude: 0 }] };
    expect(readCoordinates(json)).toEqual({ latitude: 40.71, longitude: -74.01 });
  });

  test('is null for an unknown ZIP (no results key) or an empty list', () => {
    expect(readCoordinates({ generationtime_ms: 0.1 })).toBeNull();
    expect(readCoordinates({ results: [] })).toBeNull();
  });

  test('is null for a malformed answer', () => {
    expect(readCoordinates(null)).toBeNull();
    expect(readCoordinates('nope')).toBeNull();
    expect(readCoordinates({ results: [{ latitude: '40', longitude: -74 }] })).toBeNull();
  });
});

describe('readTemperature', () => {
  test('reads the current temperature', () => {
    expect(readTemperature({ current: { time: '2026-10-28T20:45', temperature_2m: 59.9 } })).toBe(59.9);
    expect(readTemperature({ current: { temperature_2m: 0 } })).toBe(0);
  });

  test('is null when it is missing or not a number', () => {
    expect(readTemperature({})).toBeNull();
    expect(readTemperature({ current: {} })).toBeNull();
    expect(readTemperature({ current: { temperature_2m: '59.9' } })).toBeNull();
    expect(readTemperature(undefined)).toBeNull();
  });
});
