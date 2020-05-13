/*//////////////////////////////
         OBJECTIVE HTML
           Transpiler
//////////////////////////////*/

import Parser     from './parser'
import Conditions from './tokens/conditions'
import fs         from 'fs'
import path       from 'path'

export default class Transpiler {

  constructor (content = '') {

    this.parser = new Parser(content).parse()

  }

  transpile () {
    
    const code = []
    for (const i of this.parser) {
      const block  = i.block      || new String(''),
            id     = i.id         || new Number(0),
            type   = i.type       || new String(''),
            args   = i.type       || new Array(),
            params = i.parameters || new Array(),
            all    = i.all        || new Array()
      if (type.endsWith('_START')) {
        if (block === 'import') {

          code.push(block, all)

        }
      }
    }

    return code

  }

}