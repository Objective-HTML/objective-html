/*//////////////////////////////
         OBJECTIVE HTML
              Main
//////////////////////////////*/

import Parser from './core/parser'
import File   from './core/file'

new File('tests/html/sum.html').read().then(content => {
     new Parser(content).parse()
})
