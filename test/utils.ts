import fs from 'fs'
import * as ts from 'typescript'

export const getInterfaceDeclarations = (source: ts.SourceFile): Array<ts.InterfaceDeclaration> => {
  let interfaceDeclarations: Array<ts.InterfaceDeclaration> = []

  ts.forEachChild(source, (node: ts.Node) => {
    if (ts.isInterfaceDeclaration(node)) {
      interfaceDeclarations.push(node)
    }
  })

  return interfaceDeclarations
}

export const getTypeAliasDeclarations = (source: ts.SourceFile): Array<ts.TypeAliasDeclaration> => {
  let typeAliasDeclarations: Array<ts.TypeAliasDeclaration> = []

  ts.forEachChild(source, (node: ts.Node) => {
    if (ts.isTypeAliasDeclaration(node)) {
      typeAliasDeclarations.push(node)
    }
  })

  return typeAliasDeclarations
}

export const getModuleDeclarations = (source: ts.SourceFile): Array<ts.ModuleDeclaration> => {
  let moduleDeclarations: Array<ts.ModuleDeclaration> = []

  ts.forEachChild(source, (node: ts.Node) => {
    if (ts.isModuleDeclaration(node)) {
      moduleDeclarations.push(node)
    }
  })

  return moduleDeclarations
}


export function destination(path: string): string {
  return fs.readFileSync(path).toString()
}

export default undefined
