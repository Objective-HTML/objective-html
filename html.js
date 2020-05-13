/*//////////////////////////////
         OBJECTIVE HTML
              Main
//////////////////////////////*/

import Transpiler from './core/transpiler'
import FS         from 'fs'
import path       from 'path'
import Parser     from './core/parser'
const test = []
function readFile (file) {
     const content = FS.readFileSync(path.resolve(path.join(__dirname, file)), 'UTF-8')
     test.push(file)
     for (const item of new Parser(content).parse()) {
          if (item.type.endsWith('_START') && item.block === 'import') {
               for (const param of item.parameters) {
                    if (param.name === 'src') {
                         readFile(path.dirname(file) + '/' + param.value + '.html')
                    }
               }
          }
     }
}

readFile('tests/html/math.html')

console.log(new Transpiler(test.reverse()).transpile())
