import * as ts from 'typescript'

export const isTypeScriptKeyWord = (node: ts.Node): boolean  => {
  const typeKeywords = ['AnyKeyword', 'NumberKeyword', 'ObjectKeyword', 'BooleanKeyword', 'StringKeyword', 'SymbolKeyword', 'ThisKeyword', 'VoidKeyword', 'UndefinedKeyword', 'NullKeyword', 'NeverKeyword']

  return typeKeywords.indexOf(nodeKindName(node)) !== -1
}

export const isPropertySignature = (node: ts.Node): boolean => {
  return nodeKindName(node) === 'PropertySignature'
}

export const nodeKindName = (node: ts.Node) => {
  return ts.SyntaxKind[node['kind']]
}
