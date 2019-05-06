import PhpVisitor from '../../../src/ast/php/visitor'
import * as test from '../../utils'
import { DestinationFile } from '../../../src/ast/file'
import ParseTool from '../../../src/ast/parse_tool'

const namespace = 'Omissis\\AlexaSdk\\Model'

describe('AST PHP Visitor', () => {
  it('should exist', () => {
    return expect(PhpVisitor).not.toBe(undefined)
  })

  it('should visit an interface', () => {
    const parseTool = new ParseTool(
      `${__dirname}/visitor.test/interface.ts`,
      namespace
    )
    const visitor = new PhpVisitor(parseTool, '/tmp')
    const interfaceDeclaration = test.getInterfaceDeclarations(
      parseTool.sourceFile
    )[0]

    expect(visitor.visitInterface(interfaceDeclaration)).toEqual(
      new DestinationFile(
        '/tmp/Omissis/AlexaSdk/Model/FooBar.php',
        test.destination(`${__dirname}/visitor.test/interface.php`)
      )
    )
  })

  it('should visit type aliases', () => {
    const parseTool = new ParseTool(
      `${__dirname}/visitor.test/type_aliases.ts`,
      namespace
    )
    const visitor = new PhpVisitor(parseTool, '/var/tmp')
    const typeAliasDeclarations = test.getTypeAliasDeclarations(
      parseTool.sourceFile
    )

    expect(visitor.visitTypeAlias(typeAliasDeclarations[0])).toEqual(
      new DestinationFile(
        '/var/tmp/Omissis/AlexaSdk/Model/Baz.php',
        test.destination(`${__dirname}/visitor.test/type_alias_1.php`)
      )
    )

    expect(visitor.visitTypeAlias(typeAliasDeclarations[1])).toEqual(
      new DestinationFile(
        '/var/tmp/Omissis/AlexaSdk/Model/Quux.php',
        test.destination(`${__dirname}/visitor.test/type_alias_2.php`)
      )
    )
  })

  it('should visit modules', () => {
    const parseTool = new ParseTool(
      `${__dirname}/visitor.test/module.ts`,
      namespace
    )
    const visitor = new PhpVisitor(parseTool, '/tmp')
    const moduleDeclaration = test.getModuleDeclarations(
      parseTool.sourceFile
    )[0]

    expect(visitor.visitModule(moduleDeclaration)).toEqual([
      new DestinationFile(
        '/tmp/Omissis/AlexaSdk/Model/Foo/Bar/Baz1.php',
        test.destination(`${__dirname}/visitor.test/module_1.php`)
      ),
      new DestinationFile(
        '/tmp/Omissis/AlexaSdk/Model/Foo/Bar/Baz2.php',
        test.destination(`${__dirname}/visitor.test/module_2.php`)
      ),
    ])
  })
})
