import fs from 'fs'
import * as ts from 'typescript'
import { DestinationFile } from '../file';
import Visitor from '../visitor';
import handlebars from 'handlebars'
import * as typ from '../../lang/types'

const namespace: string = "Omissis\\AlexaSdk\\Model"

export default class PhpVisitor implements Visitor {
  private namespace: string

  private outputDir: string

  constructor(namespace: string, outputDir: string) {
    this.namespace = namespace
    this.outputDir = outputDir
  }
  visitModule(node: ts.ModuleDeclaration): DestinationFile {
    console.log(node.pos)
    return new DestinationFile('', '')
  }

  visitInterface(node: ts.InterfaceDeclaration): DestinationFile {
    const template = handlebars.compile(fs.readFileSync(`${__dirname}/interface.hbs`).toString())
    const fileContent = template({
      namespace: namespace,
      name: node.name.escapedText,
      properties: typ.mapProperties(node.members)
    })
    const namespaceDir = this.namespace.replace(/^\\/, '').replace(/\\/g, '\/')

    return new DestinationFile(`${this.outputDir}/${namespaceDir}/${node.name.escapedText}.php`, fileContent)
  }

  visitTypeAlias(node: ts.TypeAliasDeclaration): DestinationFile {
    console.log(node.pos)
    return new DestinationFile('', '')
  }
}
