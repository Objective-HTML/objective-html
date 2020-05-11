/*//////////////////////////////
         OBJECTIVE HTML
           Transpiler
//////////////////////////////*/

import Parser     from './parser'
import Conditions from './tokens/conditions'

export default class Transpiler {

  constructor (content = '') {
    this.parser = new Parser(content).parse()
  }

  transpile () {
    const code      = [],
          functions = []
    for (const item of this.parser) {
      const block  = item.block,
            type   = item.type,
            id     = item.id,
            args   = item.args,
            params = item.parameters,
            status = type.toLowerCase()
                         .split('_')[1]
      
      if (block !== '') {
        if (type === 'OBJECTIVE_START') {}
        else if (type === 'OBJECTIVE_END') {}
        else if (type === 'COMMENT') code.push('/*' + block.replace(/(<!--|-->)/g, '') + '*/')
        else if (type === 'TEXT') code.push('\'' + block + '\'')
        else if (type === 'VARIABLE') code.push(block.replace(/(\{|\})/g, ''))
        else if (type === 'RETURN_START') code.push('return ')
        else if (type === 'PRINT_START') code.push('console.log(')
        else if (type === 'PRINT_END') code.push(');')
        else if (type === 'FUNCTION_START') {
          let function_name = new String(),
              function_args = new String()
          if (params.length > 0) {
            for (const i of params) {
              if (i.name === 'name') {
                function_name = i.value
              }
            }
            if (function_name) {
              if (args.length > 0) {
                function_args = item.args.join(',')
              }
              code.push(`function ${function_name}(${function_args}){`)
              functions.push(function_name)
            } else {
              console.log('[!] - Function must have a name.')
            }
          } else {
            console.log('[!] - Function must have a name.')
          }
        } else if (type === 'DEFINE_START') {
          let variable_name = new String()
          if (params.length > 0) {
            for (const i of params) {
              if (i.name === 'name') {
                variable_name = i.value
              }
            }
            if (variable_name) {
              code.push(`var ${variable_name}=`)
            } else {
              console.log('[!] - Variable must have a name.')
            }
          } else {
            console.log('[!] - Variable must have a name.')
          }
        } else if (type === 'IF_START' || type === 'ELSE_START' || type === 'ELIF_START') {
          let condition_args = args,
              condition_name = new String()

          if (type === 'IF_START')        condition_name = 'if'
          else if (type === 'ELSE_START') condition_name = 'else'
          else if (type === 'ELIF_START') condition_name = 'else if'
          if (args.length > 0) {
            for (const i of args) {
              for (const condition in Conditions) {
                if (condition === i) {
                  condition_args[args.indexOf(i)] = Conditions[condition]
                }
              }
            }
            condition_args = condition_args.join('')
            code.push(`${condition_name}(${condition_args}){`)
          }
        } else if (type === 'IF_END' || 
                  type === 'FUNCTION_END' || 
                  type === 'ELSE_END' || 
                  type === 'ELIF_END') {

          code.push('}')

        } else if (type === 'DEFINE_END' || 
                  type === 'RETURN_END') {
          code.push(';')
        } else {
          for (const i of functions) {
            let function_args = args || []
            if (i === block) {
              if (type.endsWith('_START')) {
                if (args.length > 0) {
                  args = args.map(x => x.startsWith('#') ? x.replace('#', '') : x = '\'' + x + '\'')
                  function_args = args.join(',')
                }
                code.push(`${block}(${function_args});`)
              }
              
            }
          }
        }
      }
      
    }
    return code.join('')

  }

}