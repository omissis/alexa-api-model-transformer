import fs from 'fs'
import * as ts from 'typescript'
import * as str from '../../strings'
import { DestinationFile } from '../file'
import Visitor from '../visitor'
import handlebars from 'handlebars'
import ParseTool from '../parse_tool'
import * as handlebarsHelpers from '../../handlebars'

export default class PhpVisitor implements Visitor {
  private parseTool: ParseTool

  private outputDir: string

  constructor(parseTool: ParseTool, outputDir: string) {
    this.parseTool = parseTool
    this.outputDir = outputDir

    handlebarsHelpers.registerAll()
  }

  visitModule(node: ts.ModuleDeclaration): Array<DestinationFile> {
    const self = this
    const files: Array<DestinationFile> = []
    const partialNamespace: Array<string> = []
    let curNode: ts.Node = node
    let baseFqdn: string = ''

    while (ts.isModuleDeclaration(curNode)) {
      if (ts.isIdentifier(curNode.name)) {
        baseFqdn += curNode.name.escapedText.toString() + '.'
        partialNamespace.push(str.capitalize(curNode.name.escapedText.toString()))
      }
      curNode = curNode.body
    }

    if (ts.isModuleBlock(curNode)) {
      curNode.statements.forEach((statement: ts.Statement) => {
        if (ts.isInterfaceDeclaration(statement)) {
          files.push(self.visitInterface(statement, partialNamespace.join('\\'), baseFqdn))
          return
        }

        if (ts.isTypeAliasDeclaration(statement)) {
          files.push(self.visitTypeAlias(statement, partialNamespace.join('\\'), baseFqdn))
          return
        }
      })
    }

    return files.length ? files : [DestinationFile.empty()]
  }

  visitInterface(node: ts.InterfaceDeclaration, namespace: string = '', baseFqdn: string = ''): DestinationFile {
    const fullNamespace = this.parseTool.baseNamespace + (!!namespace ? '\\' + namespace : '')
    const namespaceDir = fullNamespace.replace(/^\\/, '').replace(/\\/g, '/')
    const template = handlebars.compile(fs.readFileSync(`${__dirname}/interface.hbs`).toString())

    const fileContent = template({
      namespace: fullNamespace,
      name: node.name.escapedText.toString(),
      items: this.parseTool.interfaceProperties(node),
    })

    const fqdn = (baseFqdn || '') + node.name.escapedText.toString()

    return new DestinationFile(`${this.outputDir}/${namespaceDir}/${node.name.escapedText}.php`, fileContent, fqdn)
  }

  visitTypeAlias(node: ts.TypeAliasDeclaration, namespace: string = '', baseFqdn: string = ''): DestinationFile {
    const fullNamespace = this.parseTool.baseNamespace + (!!namespace ? '\\' + namespace : '')
    const namespaceDir = fullNamespace.replace(/^\\/, '').replace(/\\/g, '/')
    const destinationFile = (templateName: string, items: Array<string | number>): DestinationFile => {
      const template = handlebars.compile(fs.readFileSync(`${__dirname}/${templateName}.hbs`).toString())

      const fileContent = template({
        namespace: fullNamespace,
        name: node.name.escapedText.toString(),
        items: items,
      })

      const fqdn = (baseFqdn || '') + node.name.escapedText.toString()

      return new DestinationFile(`${this.outputDir}/${namespaceDir}/${node.name.escapedText}.php`, fileContent, fqdn)
    }

    const types = this.parseTool.typeAliasTypes(node)
    if (types.length > 0) {
      return destinationFile('type_alias_types', types)
    }

    const values = this.parseTool.typeAliasLiterals(node)
    if (values.length > 0) {
      return destinationFile('type_alias_literals', values)
    }

    return DestinationFile.empty()
  }
}
