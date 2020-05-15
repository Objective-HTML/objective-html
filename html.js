/*//////////////////////////////
         OBJECTIVE HTML
              Main
//////////////////////////////*/

import Transpiler from './core/transpiler'
import Parser     from './core/parser'
import FS         from 'fs'
import path       from 'path'

const files = []

export default class Objective {
     
     transpile () {
          function readFile (file) {
               const content = FS.readFileSync(path.resolve(path.join(__dirname, file)), 'UTF-8')
               files.push(file)
               for (const item of new Parser(content).parse()) {
                    if (item.type === 'START' && item.block === 'import') {
                         for (const param of item.params) {
                              if (param.name === 'src') {
                                   readFile(path.dirname(file) + '/' + param.value + '.html')
                              }
                         }
                    }
               }
          }
          
          readFile('tests/html/math.html')
          
          for (const file of new Transpiler(files.reverse()).transpile()) FS.writeFileSync(path.resolve(path.join(file[0].replace('.html', '.js'))), file[1])

     }

}

new Objective().transpile()