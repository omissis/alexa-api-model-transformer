import * as ts from 'typescript'
import * as str from '../../strings'
import * as tsh from '../ts/helpers'

export class TypeFactory {
  private baseNamespace: string

  private sourceFile: ts.SourceFile

  constructor(namespace: string, sourceFile: ts.SourceFile) {
    this.baseNamespace = namespace
    this.sourceFile = sourceFile
  }

  fromEntityName(entityName: ts.EntityName): Type {
    return Type.fromEntityName(this.baseNamespace, entityName, this.sourceFile)
  }

  fromTypeElement(typeElement: ts.TypeElement): Type {
    return Type.fromTypeElement(this.baseNamespace, typeElement)
  }
}

export class Type {
  readonly code: string

  readonly doc: string

  static fromEntityName(
    namespace: string,
    entityName: ts.EntityName,
    sourceFile: ts.SourceFile
  ): Type {
    const trimmedType = str.trim(entityName.getText(sourceFile), "'")
    const phpType = typeToNativePhpType(trimmedType)

    if (phpType) return new Type(phpType)

    return new Type(
      (!!namespace ? '\\' + namespace + '\\' : '') +
        trimmedType
          .split('.')
          .map(word => word.charAt(0).toUpperCase() + word.substring(1))
          .join('\\')
    )
  }

  static fromTypeElement(namespace: string, typeElement: ts.TypeElement): Type {
    let type: string = ''
    typeElement.forEachChild((node: ts.Node) => {
      if (tsh.isTypeScriptKeyWord(node)) {
        type = keywordToPhpType(tsh.nodeKindName(node))
        return
      }
      if (ts.isTypeReferenceNode(node)) {
        if (ts.isIdentifier(node.typeName)) {
          const typeNameAsString = node.typeName.escapedText.toString()
          type =
            typeToNativePhpType(typeNameAsString) ||
            (!!namespace ? '\\' + namespace + '\\' : '') + typeNameAsString
          return
        }

        if (ts.isQualifiedName(node.typeName)) {
          type =
            (!!namespace ? '\\' + namespace + '\\' : '') +
            qualifiedNameToPhpType(node.typeName)
          return
        }
      }
      if (ts.isTypeLiteralNode(node)) {
        if (!!node.members) {
          type = 'object'
        }
      }
    })

    return new Type(typeElement.questionToken ? `?${type}` : type)
  }

  constructor(type: string) {
    this.code = type
    this.doc = type.length > 0 ? type.replace(/^\?/g, 'null|') : 'mixed'
  }
}

export const typeElementPhpName = (el: ts.TypeElement): string => {
  const phpify = (name: string) =>
    str
      .trim(name, "'")
      .split('.')
      .map(
        (word, i) =>
          (i === 0
            ? word.charAt(0).toLowerCase()
            : word.charAt(0).toUpperCase()) + word.substring(1)
      )
      .map(word => word.replace(/[\W]+/g, ''))
      .join('')

  if (ts.isStringLiteral(el.name)) return phpify(el.name.text.toString())
  if (ts.isNumericLiteral(el.name)) return phpify(el.name.text.toString())
  if (ts.isComputedPropertyName(el.name)) return phpify(el.name.getText())

  return phpify(el.name.escapedText.toString())
}

const keywordToPhpType = (keyword: string): string => {
  if (keyword === 'NumberKeyword') {
    return 'float'
  }

  if (keyword === 'BooleanKeyword') {
    return 'bool'
  }

  if (keyword === 'StringKeyword') {
    return 'string'
  }

  if (keyword === 'ObjectKeyword') {
    return 'object'
  }

  if (keyword === 'SymbolKeyword') {
    return 'object'
  }

  if (keyword === 'ThisKeyword') {
    return 'self'
  }

  if (keyword === 'TypeReference') {
  }

  return 'mixed'
}

const typeToNativePhpType = (type: string): string => {
  const normType = str.trim(type.toLowerCase(), "'")

  if (normType === 'string') return 'string'
  if (normType === 'boolean') return 'bool'
  if (normType === 'number') return 'float'
  if (normType === 'object') return 'object'
  if (normType.substring(0, 1) === '{') return 'object'
  if (normType.substring(0, 5) === 'array') return 'array'

  return ''
}

const qualifiedNameToPhpType = (qualifiedName: ts.QualifiedName): string => {
  let left = '',
    right = ''

  if (ts.isQualifiedName(qualifiedName.left)) {
    left += '\\' + str.capitalize(qualifiedNameToPhpType(qualifiedName.left))
  }

  if (ts.isIdentifier(qualifiedName.left)) {
    left += str.capitalize(qualifiedName.left.escapedText.toString())
  }

  if (ts.isQualifiedName(qualifiedName.right)) {
    right += '\\' + str.capitalize(qualifiedNameToPhpType(qualifiedName.right))
  }

  if (ts.isIdentifier(qualifiedName.right)) {
    right += str.capitalize(qualifiedName.right.escapedText.toString())
  }

  return str.ltrim(left + '\\' + right, '\\\\')
}
