export const ltrim = (str: string, chars: string): string => {
  return str.replace(new RegExp(`^[${chars}]+`), '')
}

export const rtrim = (str: string, chars: string): string => {
  return str.replace(new RegExp(`[${chars}]+$`), '')
}

export const trim = (str: string, chars: string): string => {
  return ltrim(rtrim(str, chars), chars)
}

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.substring(1)
}
