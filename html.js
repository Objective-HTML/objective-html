/*//////////////////////////////
         OBJECTIVE HTML
              Main
//////////////////////////////*/

import Lexer from './core/lexer'
import File  from './core/file'

new File('tests/html/sum.html').read().then(content => new Lexer(content).lexer())