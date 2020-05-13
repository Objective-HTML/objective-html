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
    
    const code        = [],
          variables   = []
    let   export_stat = false
    for (const i of this.parser) {
      const block  = i.block      || new String(''),
            id     = i.id         || new Number(0),
            type   = i.type       || new String(''),
            args   = i.type       || new Array(),
            params = i.parameters || new Array(),
            all    = i.all        || new Array()
      if (type === 'TEXT') block.match(/\{(.*)\}/g) ? code.push('`' +block.replace(/\{/g, '${') + '`') : code.push('\'' + block + '\'')
      else if (type === 'VARIABLE') code.push(block.replace(/(\{|\})/g, ''))
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

        }

      }
    }

    return code
  }

}