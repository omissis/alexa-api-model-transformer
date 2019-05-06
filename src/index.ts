import Explorer from './ast/explorer'
import ParseTool from './ast/parse_tool'

const namespace = 'Omissis\\AlexaSdk\\Model'
const modelsFilePath = 'node_modules/alexa-apis-for-nodejs/ask-sdk-model/index.ts'
const parseTool = new ParseTool(modelsFilePath, namespace)
const explorer = Explorer.php(parseTool)

explorer.dump(parseTool.sourceFile)
