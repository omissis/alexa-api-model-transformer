import * as ts from 'typescript'
import { DestinationFile } from './file';

export default interface Visitor {
  visitModule(node: ts.ModuleDeclaration): Array<DestinationFile>

  visitInterface(node: ts.InterfaceDeclaration): DestinationFile

  visitTypeAlias(node: ts.TypeAliasDeclaration): DestinationFile
}
