import Explorer, { Options } from './ast/explorer'
import ParseTool from './ast/parse_tool'

const namespace = 'Omissis\\AlexaSdk\\Model'
const modelsFilePath = 'node_modules/alexa-apis-for-nodejs/ask-sdk-model/index.ts'
const parseTool = new ParseTool(modelsFilePath, namespace)
const options = new Options([
  'services.ApiClient',
  'services.ApiConfiguration',
  'services.BaseServiceClient',
  'services.deviceAddress.DeviceAddressServiceClient',
  'services.directive.DirectiveServiceClient',
  'services.listManagement.ListManagementServiceClient',
  'services.LwaServiceClient',
  'services.monetization.MonetizationServiceClient',
  'services.proactiveEvents.ProactiveEventsServiceClient',
  'services.reminderManagement.ReminderManagementServiceClient',
  'services.ServiceClientFactory',
  'services.skillMessaging.SkillMessagingServiceClient',
  'services.ups.UpsServiceClient',
])
const explorer = Explorer.php(parseTool, options)

explorer.dump(parseTool.sourceFile)
