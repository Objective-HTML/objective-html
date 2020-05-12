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
          functions = [],
          modules   = []
    let   status = 'NONE',
          blck   = false
    for (const item of this.parser) {
      const block  = item.block,
            type   = item.type,
            args   = item.args,
            params = item.parameters
      if (block !== '') {
        if (type === 'OBJECTIVE_START') {}
        
        else if (type === 'OBJECTIVE_END') {}

        else if (type === 'COMMENT') code.push('/*' + block.replace(/(<!--|-->)/g, '') + '*/')

        else if (type === 'TEXT') {
          if (block.match(/\{(.*)\}/g)) {
            code.push('`' + block.replace(/\{/g, '${') + '`')
          } else {
            code.push('\'' + block + '\'')
          }
        }

        else if (type === 'VARIABLE') code.push(block.replace(/(\{|\})/g, '').replace('::', '.'))

        else if (type === 'RETURN_START') code.push('return ')

        else if (type === 'PRINT_START') code.push('console.log(')

        else if (type === 'PRINT_END') code.push(');')

        else if (type === 'IMPORT_START') {
          blck = true
          let module_path = '',
              module_name = ''
          if (params.length > 0) {
            for (const i of params) {
              if (i.name === 'src') {
                module_path = i.value
              } else if (i.name === 'name') {
                module_name = i.value
              }
            }
            if (module_path) {
              if (module_name === '') {
                module_name = module_path.split('/').pop().replace('.html', '.js')
              }
              if (!module_path.endsWith('.js') && module_path.startsWith('./')) module_path = module_path + '.js'
              console.log(module_path)
              code.push(`const ${module_name}=require('${module_path}');`)
              modules.push(module_name)
            }
          }
        }

        else if (type === 'EXPORT_START') {
          code.push('module.exports = {')
          status = 'EXPORT'
        } else if (type === 'FOR_START') {

          if (args.length > 0) {
            let for_args = args.join(' ').split(':').map(x => x.trim())
            for (const arg of for_args) {
              for (const i in Conditions) {
                if (arg.includes(i)) {
                  for_args[for_args.indexOf(arg)] = arg.replace(i, Conditions[i])
                }
              }
            }
            for_args[for_args.indexOf(for_args.filter(x => x.match(/\s[=]\s/g)).join(''))] = 'var ' + for_args.filter(x => x.match(/\s[=]\s/g)).join('') 
            code.push(`for(${for_args.join(';')}){`)
            blck = true
          }
        } else if (type === 'WHILE_START') {

          if (args.length > 0) {
            let while_args = args.join(' ')
            for (const arg of while_args) {
              for (const i in Conditions) {
                if (while_args.includes(i)) {
                  while_args = while_args.replace(i, Conditions[i])
                }
              }
            }
            code.push(`while(${while_args}){`)
            blck = true
          }
        } else if (type === 'FUNCTION_START') {
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

              if (status === 'EXPORT') {
                code.push(`${function_name}:function(${function_args}){`)
              } else {
                code.push(`function ${function_name}(${function_args}){`)
              }
              blck = true
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

              if (status === 'EXPORT') {

                code.push(`${variable_name}:`)

              } else {

                code.push(`var ${variable_name}=`)

              }

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
            blck = true

          }

        } else if (type === 'IF_END'      || 
                  type === 'FUNCTION_END' || 
                  type === 'ELSE_END'     || 
                  type === 'ELIF_END'     ||
                  type === 'EXPORT_END'   ||
                  type === 'FOR_END'      ||
                  type === 'WHILE_END') {
          
          code.push('}')
          if (type === 'FUNCTION_END') {
            if (status === 'EXPORT') {
              code.push(',')
              blck = false
            }
          }

        } else if (type === 'DEFINE_END' || 
                   type === 'RETURN_END') {

          if (type === 'DEFINE_END') {
            if (status === 'EXPORT') {
              code.push(',')
            } else {
              code.push(';')
            }
          } else {
            code.push(';')
          }
          blck = false

        } else {

          for (const i of modules) {
            blck = true
            let function_args = []
            if (block.startsWith(i)) {
              if (type.endsWith('_START')) {
                if (item.all.length > 0) {
                  for (const all_item of item.all) {
                    if (all_item.includes('=')) {
                      if (all_item.split('=')[0] === 'var') {
                        function_args.push(all_item.split('=')[1])
                      }
                    } else {
                      if (all_item.startsWith('{') && all_item.endsWith('}')) {
                        function_args.push(all_item.slice(1, all_item.length - 1))
                      } else {
                        function_args.push('\'' + all_item + '\'')
                      }
                    }
                    
                  }
                }

                function_args = function_args.join(',')
                code.push(`${i}.${block.split('::')[1]}(${function_args})`)

              }
            }
          }

          for (const i of functions) {

            let function_args = args || []

            if (i === block) {

              if (type.endsWith('_START')) {

                if (args.length > 0) {

                  args = args.map(x => x.startsWith('{') && x.endsWith('}') ?x =  x.replace(/(\{|\})/, '') : x = '\'' + x + '\'')
                  function_args = args.join(',')

                } else if (params.length > 0) {
                  console.log(params)
                }

                code.push(`${block}(${function_args})`)

              }
              
            }

          }

        }

      }
      
    }

    return code.join('')

  }

}