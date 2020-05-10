/*//////////////////////////////
         OBJECTIVE HTML
           Transpiler
//////////////////////////////*/

import Parser from './parser'

export default class Transpiler {

  constructor (content = '') {
    this.parser = new Parser(content).parse()
  }
  
}