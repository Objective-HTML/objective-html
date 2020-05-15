/*//////////////////////////////
         OBJECTIVE HTML
           Transpiler
//////////////////////////////*/

import Parser     from './parser'
import Conditions from './tokens/conditions'
import FS         from 'fs'
import PATH       from 'path'
import { cpus } from 'os'

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
              params = i.params     || new Array(),
              all    = i.all        || new Array()
      
        if (type === 'START') {

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
          }

        } else if (type === 'END') {
          if (block === 'export') {
            export_stat = false
            code.push('};')
          } else if (block === 'import') {
            code.push(';')
          }
        }
      }
      all.set(this.filename[this.parser.indexOf(parsed)], code.join(''))
      code = []
    }
    console.log(all)
    return all
  }

}