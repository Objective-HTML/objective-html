/*//////////////////////////////
         OBJECTIVE HTML
           Transpiler
//////////////////////////////*/

import Parser     from './parser'
import Conditions from './tokens/conditions'
import FS         from 'fs'
import PATH       from 'path'
import Beautifer  from 'js-beautify'

export default class Transpiler {

  constructor (content = '', filename = '') {
    this.parser    = []
    this.filename  = []
    for (const file of content) {
      this.parser.push(new Parser(FS.readFileSync(PATH.resolve(PATH.join(file)), 'UTF-8')).parse())
      this.filename.push(file)
    }
    this.functions = new Map()
    this.modules   = new Map()

  }

  transpile () {
    
    let   code        = [],
          variables   = [],
          all         = new Map()
    let   export_stat = false
    
    for (const parsed of this.parser) {
      let previous = []
      for (const i of parsed) {
        const block  = i.block      || String(''),
              id     = i.id         || Number(0),
              type   = i.type       || String(''),
              args   = i.args       || [],
              params = i.params     || [],
              all    = i.all        || []
        if (type === 'TEXT') {
          if (block.includes(':')) {
            code.push('[' + block.slice(0, block.length - 1).replace(/:/g, ',') + ']')
          } else if (block.match(/\d+/g)) {
            if (block.match(/\d+/g).join(' ').trim().length === block.length) {
              code.push(parseInt(block))
            } else {
              code.push('\'' + block + '\'')
            }
          } else {
            if (block.match(/\{\w+\}/g)) {
              if (block.match(/\{\w+\}/g).length > 0) {
                code.push('`' + block.replace(/\{/g, '${') + '`')
              } else {
                code.push('\'' + block + '\'')
              }
            } else {
              code.push('\'' + block + '\'')
            }
          }
        }
        else if (type === 'VARIABLE') code.push(block.slice(1, block.length - 1))
        else if (type === 'START') {

          if (block === 'export') {
            code.push('module.exports={')
            export_stat = true
          } else if (block === 'import') {
            let NAME = undefined,
                SRC  = undefined,
                AS   = undefined

            if (params.length > 0) {
              for (const param of params) {
                if (param.name === 'src' || param.name === 'source') SRC = param.value
                else if (param.name === 'as') AS = param.value
                else if (param.name === 'name') NAME = param.value
              }
              if (SRC) {
                if (AS) {
                  if (AS === 'js') SRC = SRC.replace('./', '')
                  else if (AS === 'package') SRC = './modules/' + SRC.replace('./', '')
                } else SRC  = './' + SRC + '.html'
                if (!NAME) NAME = SRC.split('/').pop().replace('.html', '')
                code.push(`const ${NAME}=require('${SRC.replace('.html', '.js')}')`)
                this.modules.set(this.filename.filter(x => x.includes(NAME))[0], NAME)
              }
            }
          } else if (block === 'define') {
            let NAME = undefined
            if (params.length > 0) {
              for (const param of params) {
                if (param.name === 'name') NAME = param.value
              }
              if (NAME) {
                if (variables.includes(NAME)) {
                  if (code.length > 0) {
                    // code.filter(x => console.log(x.toString()))
                    if (code.filter(x => (x.toString().startsWith('const') || x.toString().startsWith('let')) && x.toString().includes(NAME)).length > 0) {
                      code[code.indexOf(code.filter(x => (x.toString().startsWith('const') || x.toString().startsWith('let')) && x.toString().includes(NAME))[0])] = `let ${NAME}=`
                    }
                  }
                } else {
                  variables.push(NAME)
                  code.push(`const ${NAME}=`)
                }

              }
            }
          } else if (block === 'function') {
            if (params.length > 0) {
              let NAME = undefined,
                  ARGS = []
              for (const param of params) if (param.name === 'name') NAME = param.value
              if (args.length > 0) {
                for (const arg of args) {
                  ARGS.push(arg)
                }
              }
              if (export_stat) {
                code.push(`${NAME}:function(${ARGS.length > 0 ? ARGS.join(',') : ''}){`)
                this.functions.set(NAME, this.filename[this.parser.indexOf(parsed)])
              }
              else code.push(`function ${NAME}(${ARGS.length > 0 ? ARGS.join('', ) : ''}){`)
            }
          } else if (block === 'if' || block === 'elif') {
            const condition = block === 'if' ? 'if' : 'else if'
            if (args.length > 0) {
              let cond_args = args
              for (const arg of cond_args) {
                for (const Condition in Conditions) {
                  if (Condition === arg) {
                    cond_args[cond_args.indexOf(arg)] = Conditions[Condition]
                  }
                }
              }
              cond_args = cond_args.map(x => x.match(/\w+/g) ? x.startsWith('{') && x.endsWith('}') ? x.slice(1, x.length - 1) : '\'' + x + '\'' : x)
              code.push(`${condition}(${cond_args.join('')}){`)
            }
          } else if (block === 'else') {
            code.push('else{')
          } else if (block === 'while') {
            if (args.length > 0) {
              let while_args = args
              for (const arg of while_args) {
                for (const Condition in Conditions) {
                  if (Condition === arg) {
                    while_args[while_args.indexOf(arg)] = Conditions[Condition]
                  }
                }
              }
              while_args = while_args.map(x => x.match(/\w+/g) ? x.startsWith('{') && x.endsWith('}') ? x.slice(1, x.length - 1) : '\'' + x + '\'' : x)
              code.push(`while(${while_args.join('')}){`)
            }
          } else {
            for (const mod of this.modules) {
              for (const func of this.functions) {
                if (mod[0] === func[1]) {
                  if (block === func[0]) {
                    code.push(`${mod[1]}.${func[0]}(`)
                    if (all.length > 0) {
                      const func_args = []
                      for (const arg of all) {
                        if (arg.startsWith('{') && arg.endsWith('}')) {
                          func_args.push(arg.slice(1, arg.length - 1))
                        } else if (arg.split('=').length > 1) {
                          if (arg.includes('var=')) {
                            func_args.push(arg.slice(5, arg.length - 1).split(' '))
                          } else if (arg.includes('arg=')) {
                            func_args.push(arg.slice(4, arg.length))
                          }
                        } else {
                          func_args.push(arg)
                        }
                      }
                      if (func_args.flat().length > 0) {
                        code.push(`${func_args.flat().join(',')})`)
                        parsed[parsed.indexOf(i) + 1] = ''
                      }
                    } else {
                      previous.push('FUNCTION')
                    }
                  }
                }
              }
            }
          }

        } else if (type === 'END') {
          if (block === 'export') {
            export_stat = false
            code.push('}')
          } else if (block === 'import') {
            code.push('\n')
          } else if (block === 'define') {
            if (export_stat) code.push(',')
            else code.push('')
          } else if (block === 'function') {
            if (export_stat) code.push('},')
            else code.push('}')
          } else if (block === 'if' || block === 'elif' || block ==='else') {
            code.push('}')
          } else if (block === 'while') {
            code.push('}')
          } else {
            if (previous.includes('FUNCTION')) {
              if (previous.filter(x => x === 'FUNCTION').length === previous.length) {
                if (previous.length === 1) code.push(')\n')
                else {
                  for (const prev in previous) {
                    code.push(')')
                    previous = previous.splice(prev, 1)
                  }
                }
              }
            }
          }
        }
      }
      
      if (code.join('').endsWith('}')) {
        if (code[code.length - 2].endsWith(',')) {
          code[code.length - 2] = code[code.length - 2].replace(',', '')
        }
      }
      all.set(this.filename[this.parser.indexOf(parsed)], Beautifer(code.join('')))
      code = []
    }
    
    return all
  }

}