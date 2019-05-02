export const indent = (folds: number) => Array(folds + 1).join('    ')

export const ltrim = (str: string, chars: string): string => {
  return str.replace(new RegExp(`^[${chars}]+`), '')
}

export const rtrim = (str: string, chars: string): string => {
  return str.replace(new RegExp(`[${chars}]+$`), '')
}

export const trim = (str: string, chars: string): string => {
  return ltrim(rtrim(str, chars), chars)
}
