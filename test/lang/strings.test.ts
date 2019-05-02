import * as str from '../../src/lang/strings';

describe("indent", () => {
  it("should print 4 spaces for 1 indent level", () => {
    expect(str.indent(1)).toBe('    ')
  })
  it("should print 8 spaces for 2 indent level", () => {
    expect(str.indent(2)).toBe('        ')
  })
  it("should print 12 spaces for 3 indent level", () => {
    expect(str.indent(3)).toBe('            ')
  })
})

describe("ltrim", () => {
  it("replaces space characters at the beginning of a string", () => {
    expect(str.ltrim('     foo', ' \t\n')).toBe('foo')
  })
  it("replaces alphanumeric characters at the beginning of a string", () => {
    expect(str.ltrim('f00b4r     ', 'A-z0-9')).toBe('     ')
  })
})

describe("rtrim", () => {
  it("replaces space characters at the end of a string", () => {
    expect(str.rtrim('foo     ', ' \t\n')).toBe('foo')
  })
  it("replaces alphanumeric characters at the end of a string", () => {
    expect(str.rtrim('     f00b4r', 'A-z0-9')).toBe('     ')
  })
})

describe("trim", () => {
  it("replaces space characters at the beginning and at the end of a string", () => {
    expect(str.trim('     foo     ', ' \t\n')).toBe('foo')
  })
  it("replaces alphanumeric characters at the beginning and at the end of a string", () => {
    expect(str.trim('f00     b4r', 'A-z0-9')).toBe('     ')
  })
})
