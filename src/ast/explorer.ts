import * as ts from 'typescript'
import { DestinationFile } from './file';
import Visitor from './visitor';
import PhpVisitor from './php/visitor';

export default class Explorer {
  private visitor: Visitor

  constructor(visitor: Visitor) {
    this.visitor = visitor
  }

  static php(): Explorer {
    return new Explorer(
      new PhpVisitor('Omissis\\AlexaSdk\\Model', '/tmp')
    )
  }

  explore(source: ts.SourceFile): Array<DestinationFile> {
    const self = this

    let files: Array<DestinationFile> = []

    ts.forEachChild(source, (node: ts.Node) => {
      if (ts.isInterfaceDeclaration(node)) {
        files.push(self.visitor.visitInterface(node))
        return
      }

      if (ts.isTypeAliasDeclaration(node)) {
        files.push(self.visitor.visitTypeAlias(node))
        return
      }

      if (ts.isModuleDeclaration(node)) {
        files.push(self.visitor.visitModule(node))
        return
      }
    })

    return files
  }
}
