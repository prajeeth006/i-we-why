import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OverrideServiceService } from './override-service.service';

describe('OverrideServiceService', () => {
  let service: OverrideServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OverrideServiceService]
    });
    service = TestBed.inject(OverrideServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should parse given division into a number', () => {
    // Test cases for parsing division strings into numbers
    expect(service.parseDivisionIntoNumber('1/5')).toBe(0.2); // Valid fraction
    expect(service.parseDivisionIntoNumber('3/3')).toBe(1); // Valid fraction, result is 1
    expect(service.parseDivisionIntoNumber('3')).toBe(3); // A single number should return the same value
    expect(service.parseDivisionIntoNumber(5)).toBe(5); // A number passed directly should return the same value
  });

  it('should handle invalid input gracefully', () => {
    // Invalid fraction input, such as empty string or non-numeric values
    expect(service.parseDivisionIntoNumber('abc')).toBeNaN(); // Invalid fraction, should return NaN
  });

  it('should handle cases with both numerator and denominator as zero', () => {
    // Test a case where both numerator and denominator are zero
    expect(service.parseDivisionIntoNumber('0/0')).toBeNaN(); // Division by zero, should return NaN
  });

  it('should return correct result for negative fractions', () => {
    // Test case for negative fractions
    expect(service.parseDivisionIntoNumber('-1/2')).toBe(-0.5); // Negative fraction
    expect(service.parseDivisionIntoNumber('1/-2')).toBe(-0.5); // Negative denominator
    expect(service.parseDivisionIntoNumber('-3/-3')).toBe(1); // Negative fraction with negative numbers
  });

  it('should parse numeric string properly', () => {
    // Test numeric strings
    expect(service.parseDivisionIntoNumber('5')).toBe(5); // Numeric string, should return the same number
    expect(service.parseDivisionIntoNumber('-5')).toBe(-5); // Negative numeric string, should return the same number
  });
});
