import * as Handlebars from 'handlebars'
import { Type } from 'ast/php/types'

export function registerAll(): void {
  Handlebars.registerHelper(
    'unlessEmpty',
    (context): string => {
      if ((context || []).length > 0) {
        return context
      }

      return ''
    }
  )

  Handlebars.registerHelper(
    'phpdocParams',
    (context): string => {
      const items: Array<{ name: string; type: Type }> = []

      for (let i = 0, len = (context || []).length; i < len; ++i) {
        const type: Type = context[i].type

        if (type.code.replace(/^\?/, '') !== type.doc.replace(/^null\|/, '')) {
          items.push(context[i])
        }
      }

      if (items.length === 0) {
        return ''
      }

      return (
        items.reduce<string>((previousValue: string, currentValue: { name: string; type: Type }): string => {
          return `${previousValue}\n     * @param ${currentValue.type.doc} $${currentValue.name}`
        }, '    /**') + '\n     */'
      )
    }
  )

  Handlebars.registerHelper(
    'phpdocReturn',
    (context): string => {
      const type: Type = context.type

      if (type.code.replace(/^\?/, '') !== type.doc.replace(/^null\|/, '')) {
        return `    /**\n     * @return ${context.type.doc}\n     */`
      }

      return ''
    }
  )

  Handlebars.registerHelper('fqdn', function(value) {
    if (!value) return ''

    if ('string' === value) return '"string"'
    if ('boolean' === value) return '"bool"'
    if ('number' === value) return '"float"'
    if ('object' === value) return '"object"'

    return `${value}::class`
  })
}
