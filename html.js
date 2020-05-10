/*//////////////////////////////
         OBJECTIVE HTML
              Main
//////////////////////////////*/

import Transpiler from './core/transpiler'
import File       from './core/file'

new File('tests/html/sum.html').read().then(content => {
     console.log(new Transpiler(content).transpile())
})
