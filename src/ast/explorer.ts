import * as ts from 'typescript'
import fs from 'fs'
import path from 'path'
import { DestinationFile } from './file'
import Visitor from './visitor'
import PhpVisitor from './php/visitor'
import ParseTool from './parse_tool'

export class Options {
  readonly declarationsBlacklist: Array<string> = []

  constructor(declarationsBlacklist: Array<string>) {
    this.declarationsBlacklist = declarationsBlacklist
  }
}

export default class Explorer {
  private visitor: Visitor

  private options: Options

  constructor(visitor: Visitor, options: Options = new Options([])) {
    this.visitor = visitor
    this.options = options
  }

  static php(parseTool: ParseTool, options: Options): Explorer {
    return new Explorer(new PhpVisitor(parseTool, 'pkg'), options)
  }

  explore(source: ts.SourceFile): Array<DestinationFile> {
    const self = this

    let files: Array<DestinationFile> = []

    ts.forEachChild(
      source,
      (node: ts.Node): void => {
        if (ts.isInterfaceDeclaration(node)) {
          files = files.concat([this.visitor.visitInterface(node)].filter(self.filterBlacklistedFiles.bind(self)))
          return
        }

        if (ts.isTypeAliasDeclaration(node)) {
          files = files.concat([this.visitor.visitTypeAlias(node)].filter(self.filterBlacklistedFiles.bind(self)))
          return
        }

        if (ts.isModuleDeclaration(node)) {
          files = files.concat(this.visitor.visitModule(node).filter(self.filterBlacklistedFiles.bind(self)))
          return
        }
      }
    )

    return files.filter((file: DestinationFile): boolean => !file.isEmpty())
  }

  dump(source: ts.SourceFile): void {
    this.explore(source).forEach(
      (file: DestinationFile): void => {
        fs.mkdirSync(path.dirname(file.path), { recursive: true } as any)
        fs.writeFileSync(file.path, file.content)
      }
    )
  }

  private filterBlacklistedFiles(file: DestinationFile): boolean {
    return this.options.declarationsBlacklist.indexOf(file.sourceDeclaration) === -1
  }
}
