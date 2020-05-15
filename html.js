/*//////////////////////////////
         OBJECTIVE HTML
              Main
//////////////////////////////*/

import Transpiler from './core/transpiler'
import Parser     from './core/parser'
import FS         from 'fs'
import path       from 'path'
const test = []

// console.log(new Transpiler(FS.readFileSync('tests/html/math.html', 'UTF-8')).transpile())

function readFile (file) {
     const content = FS.readFileSync(path.resolve(path.join(__dirname, file)), 'UTF-8')
     test.push(file)
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
console.log(test)
const files = new Transpiler(test.reverse()).transpile()

for (const file of files) {
     FS.writeFileSync(path.resolve(path.join(file[0].replace('.html', '.js'))), file[1])
}


var util = require('util'),
    vm = require('vm')

let helloScript = new vm.Script(';', {
     produceCachedData: true /* This is required for Node.js < 10.0.0 */
});


// or in Node.js >= 10
let helloBuffer = helloScript.createCachedData();

helloScript.runInThisContext();