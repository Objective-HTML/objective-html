/*//////////////////////////////
         OBJECTIVE HTML
           Transpiler
//////////////////////////////*/

import Parser     from './parser'
import Conditions from './tokens/conditions'
import FS         from 'fs'
import PATH       from 'path'
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
      let previous_block = ''
      for (const i of parsed) {
        const block  = i.block      || new String(''),
              id     = i.id         || new Number(0),
              type   = i.type       || new String(''),
              args   = i.args       || new Array(),
              params = i.parameters || new Array(),
              all    = i.all        || new Array()
        if (type === 'TEXT') {
          if (block.match(/\{(.*)\}/g)) {
            code.push('`' +block.replace(/\{/g, '${') + '`')
          } else {
            code.push('\'' + block + '\'')
          }
        }
        else if (type === 'VARIABLE') {
          const block_var = block.replace(/(\{|\})/g, '')
          if (block_var.replace(/ {2}/g, '').includes(' ')) code.push('[' + block_var.replace(/ {2}/g, '').replace(/ /g, ',') + ']')
          else code.push(block_var)
        }
        else if (type === 'COMMENT') code.push(block.replace('<!--', '/*').replace('-->', '*/'))
        else if (type.endsWith('_START')) {
          
          if (block === 'import') {
            let SRC  = undefined,
                AS   = undefined,
                NAME = undefined
  
            if (params.length < 1) return new Error('test')
  
            for (const param of params) {
              if (param.name === 'src')       SRC  = param.value
              else if (param.name === 'as')   AS   = param.value
              else if (param.name === 'name') NAME = param.value
            }
  
            if (SRC) {
              if (AS) {
                if      (AS === 'JS')      SRC  = SRC.replace('./', '') 
                else if (AS === 'package') SRC  = './modules/' + SRC.replace('./', '')
              } else                       SRC  = './' + SRC + '.html'
              if        (!NAME)            NAME = SRC.split('/').pop().replace('.html', '')
              code.push(`const ${NAME}=require('${SRC.replace('.html', '.js')}')`)
              this.modules.set(this.filename.filter(x => x.includes(NAME))[0], NAME)
            }
  
          } else if (block === 'export') {
  
            code.push(`module.exports={`)
            export_stat = true
  
          } else if (block === 'define') {
            let NAME = undefined,
                KWRD = ''
            for (const param of params) {
              if (param.name === 'name') {
                if (!variables.includes(param.value)) {
                  variables.push(param.value)
                  KWRD = 'const'
                } else {
                  if (export_stat) code[code.indexOf(code.filter(x => x.includes(param.value))[0])] = `${param.value}:`
                  else code[code.indexOf(code.filter(x => x.includes(param.value))[0])] = `let ${param.value}=`
                }
                NAME = param.value
              }
            }
            if (NAME) {
              if (export_stat) code.push(`${NAME}:`.trim())
              else code.push(`${KWRD} ${NAME}=`.trim())
            }
          } else if (block === 'function') {
            let NAME = undefined,
                ARGS = []
            if (params.length > 0) {
              for (const param of params) {
                if (param.name === 'name') NAME = param.value
              }
            }
            if (args.length > 0) {
              for (const arg of args) {
                ARGS.push(arg)
              }
            }
            if (NAME) {
  
              if (export_stat) {
                code.push(`${NAME}:function(${ARGS.length > 0 ? ARGS.join(', ') : ''}){`)
                this.functions.set(NAME, this.filename[this.parser.indexOf(parsed)])
              }
              else code.push(`function ${NAME}(${ARGS.length > 0 ? ARGS.join(', ') : ''}){`)
            }
          }
          else {
            for (const func of this.functions) {
              for (const mod of this.modules) {
                if (func[1] === mod[0]) {
                  if (func[0] === block) {
                    if (parsed[parsed.indexOf(i) + 1].type === 'TEXT' || parsed[parsed.indexOf(i) + 1].type === 'VARIABLE') {
                      code.push(`${mod[1]}.${block}(`)
                    } else {
                      const func_args = args.map(x => x.startsWith('{') && x.endsWith('}') ? x = x.replace(/(\{|\})/g, '') : x = '\'' + x + '\'')
                      code.push(`${mod[1]}.${block}(${func_args.length > 0 ? func_args.join(', ') : ''}`)
                    }
                    
                  }
                }
              }
            }
          }
        } else if (type.endsWith('_END')) {
  
          if (block === 'import') {
            code.push(';')
          }
  
          else if (block === 'export') {
            code.push('};')
            export_stat = false
          }
  
          else if (block === 'define') {
  
            if (export_stat) code.push(',')
            else code.push(';')
  
          } else if (block === 'print') {

            code.push(')')
          }
  
        }
      }
      all.set(this.filename[this.parser.indexOf(parsed)], code)
      code = []
    }

    return all
  }

}