import * as ts from 'typescript'
import Explorer from './ast/explorer';

const modelsFilePath = './node_modules/alexa-apis-for-nodejs/ask-sdk-model/index.ts'
// const modelsFilePath = './test/ast/explorer.test/empty.ts'
const source = ts.createProgram([modelsFilePath], {}).getSourceFile(modelsFilePath)
const explorer = Explorer.php()

explorer.explore(source)
