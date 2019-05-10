import * as ts from 'typescript'
import { DestinationFile } from './file'

export default interface Visitor {
  visitModule(node: ts.ModuleDeclaration): Array<DestinationFile>

  visitInterface(node: ts.InterfaceDeclaration, namespace?: string, baseFqdn?: string): DestinationFile

  visitTypeAlias(node: ts.TypeAliasDeclaration, namespace?: string, baseFqdn?: string): DestinationFile
}
