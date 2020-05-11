/*//////////////////////////////
         OBJECTIVE HTML
              Main
//////////////////////////////*/

import Transpiler from './core/transpiler'
import File       from './core/file'
import FS         from 'fs'

new File('tests/html').filewalker((error, files) => {
     if (error) throw error 
     for (const i of files) {
          if (i.endsWith('.html')) {
               FS.readFile(i, 'UTF-8', (error, content) => {
                    FS.writeFile(i.replace('.html', '.js'), new Transpiler(content).transpile(), error => {
                         if (error) throw error
                    })
               })
          }
     }
})

