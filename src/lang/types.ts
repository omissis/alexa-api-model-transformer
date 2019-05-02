import ts from 'typescript'
import * as str from '../lang/strings'

type TemplateProperty = { name: string, type: string }

export const mapProperties = (members: ts.NodeArray<ts.TypeElement>): Array<TemplateProperty> => {
  return propertySignatures(members).map((member): TemplateProperty => {
    return {
      name: toPhpName(typeElementName(member)),
      type: toPhpType('TODO', typeElementType(member))
    }
  })
}

export const propertySignatures = (members: ts.NodeArray<ts.TypeElement>): Array<ts.PropertySignature> => {
  return members.filter((value: ts.TypeElement): boolean => (nodeKindName(value) === 'PropertySignature')) as Array<ts.PropertySignature>
}

export const methodSignatures = (members: ts.NodeArray<ts.TypeElement>): Array<ts.MethodSignature> => {
  return members.filter((value: ts.TypeElement): boolean => (nodeKindName(value) === 'MethodSignature')) as Array<ts.MethodSignature>
}

export const toPhpType = (namespace: string, type: string): string => {
  const trimmedType = str.trim(type, '\'')

  if (trimmedType === 'string') return 'string'
  if (trimmedType === 'boolean') return 'bool'
  if (trimmedType === 'number') return 'float'
  if (trimmedType === 'object') return 'object'
  if (trimmedType.substring(0, 1) === '{') return 'object'
  if (trimmedType.substring(0, 5) === 'Array') return 'array'

  return '\\' + namespace + '\\' +
    trimmedType
      .split('.')
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join('\\')
}

export const toPhpName = (name: string): string => {
  return str.trim(name, '\'')
    .split('.')
    .map((word, i) => (i === 0 ? word.charAt(0).toLowerCase() : word.charAt(0).toUpperCase()) + word.substring(1))
    .join('')
}

export const nodeKindName = (node: ts.Node) => {
  return ts.SyntaxKind[node['kind']]
}

export const typeElementType = (el: ts.TypeElement): string => 'string'

export const typeElementKind = (el: ts.TypeElement): string => ts.SyntaxKind[el.kind]

export const typeElementName = (el: ts.TypeElement): string => {
  if (ts.isStringLiteral(el.name)) return el.name.text
  if (ts.isNumericLiteral(el.name)) return el.name.text
  if (ts.isComputedPropertyName(el.name)) return el.name.getText()

  return el.name.escapedText.toString()
}
