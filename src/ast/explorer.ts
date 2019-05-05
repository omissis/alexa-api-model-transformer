import * as ts from 'typescript'
import fs from 'fs'
import path from 'path'
import { DestinationFile } from './file';
import Visitor from './visitor';
import PhpVisitor from './php/visitor';
import ParseTool from './parse_tool';

export default class Explorer {
  private visitor: Visitor

  constructor(visitor: Visitor) {
    this.visitor = visitor
  }

  static php(parseTool: ParseTool): Explorer {
    return new Explorer(new PhpVisitor(parseTool, 'pkg'))
  }

  explore(source: ts.SourceFile): Array<DestinationFile> {
    const self = this

    let files: Array<DestinationFile> = []

    ts.forEachChild(source, (node: ts.Node): void => {
      if (ts.isInterfaceDeclaration(node)) {
        files.push(self.visitor.visitInterface(node))
        return
      }

      if (ts.isTypeAliasDeclaration(node)) {
        files.push(self.visitor.visitTypeAlias(node))
        return
      }
      if (ts.isModuleDeclaration(node)) {
        files = files.concat(self.visitor.visitModule(node))
        return
      }
    })

    return files.filter((file: DestinationFile): boolean => !file.isEmpty())
  }

  dump(source: ts.SourceFile): void {
    this.explore(source).forEach((file: DestinationFile): void => {
      fs.mkdirSync(path.dirname(file.path), { recursive: true } as any)
      fs.writeFileSync(file.path, file.content)
    })
  }
}
