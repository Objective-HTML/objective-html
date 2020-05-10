/*//////////////////////////////
         OBJECTIVE HTML
           Transpiler
//////////////////////////////*/

import Parser from './parser'

export default class Transpiler {

  constructor (content = '') {
    this.parser = new Parser(content).parse()
  }

  transpile () {

    const code = []

    for (const item of this.parser) {
      const block  = item.block,
            type   = item.type,
            id     = item.id,
            args   = item.args,
            params = item.parameters,
            status = type.toLowerCase()
                         .split('_')[1]
      console.log(type, block)
      switch (type) {

        case 'COMMENT': {

          code.push(block.replace('<!--', '/*')
                         .replace('-->', '*/'))
          break
          
        }

        case 'DEFINE_START' : {

          code.push('var ' + item.parameters[0].value + '=')
          break

        }

        case 'VARIABLE': {
          
          code.push(block.replace(/(\{|\})/g, ''))
          break
          
        }

        case 'TEXT': {
          code.push('"' + block + '"')
          break
        }

        case 'DEFINE_END': {

          code.push(';')

        }
        
        case 'FUNCTION_START': {
          let function_args = ''
          let function_name = ''
          for (const i of params) {
            if (i.name) {
              function_name = i.value
            }
          }
          if (args) {
            function_args = args.join(',')
          }
          code.push('function ' + function_name + '(' + function_args + ') {')
          break
        }

        case 'FUNCTION_END': {
          code.push('}')
          break
        }

        case 'OBJECTIVE_START': {
          console.log(id)
          break
        }

      }
      
    }
    
    console.log(code)

  }

}