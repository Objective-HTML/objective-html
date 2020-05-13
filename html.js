/*//////////////////////////////
         OBJECTIVE HTML
              Main
//////////////////////////////*/

import Transpiler from './core/transpiler'
import FS         from 'fs'
import path       from 'path'
import Parser     from './core/parser'

function readFile (file) {
     FS.readFile(path.resolve(path.join(__dirname, file)), 'UTF-8', (error, content) => {
          if (error) throw error
          console.log(new Transpiler(content).transpile())
          for (const item of new Parser(content).parse()) {
               if (item.type.endsWith('_START') && item.block === 'import') {
                    for (const param of item.parameters) {
                         if (param.name === 'src') {
                              readFile(path.dirname(file) + '/' + param.value + '.html')
                         }
                    }
               }
          }
     })
}

readFile('tests/html/math.html')