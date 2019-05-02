import fs from 'fs'
import * as ts from 'typescript'
import Explorer from '../../src/ast/explorer'
import { DestinationFile } from '../../src/ast/file'

describe("AST Explorer, PHP flavour", () => {
  const explorer = Explorer.php()

  it("should exist", () => {
    expect(Explorer).not.toBe(undefined)
  })

  it("should return empty array if source file is empty", () => {
    expect(explorer.explore(source('empty'))).toEqual([])
  })

  it("should return an array containing a single interface", () => {
    expect(explorer.explore(source('one_interface'))).toEqual([
      new DestinationFile(
        '/tmp/Omissis/AlexaSdk/Model/FooBar.php',
        destination('one_interface')
      )
    ])
  })
})

function source(name: string): ts.SourceFile {
  const path = `${__dirname}/explorer.test/${name}.ts`

  return ts.createProgram([path], {}).getSourceFile(path)
}

function destination(name: string): string {
  const path = `${__dirname}/explorer.test/${name}.php`

  return fs.readFileSync(path).toString()
}
