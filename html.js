/*//////////////////////////////
         OBJECTIVE HTML
              Main
//////////////////////////////*/

import FS             from 'fs'
import PATH           from 'path'
import ObjectiveAddon from './core/addon'
import Beautify       from 'js-beautify'
import Glob           from 'glob'
import * as babel     from "@babel/core";
import Uglify         from 'uglify-es'

const content = FS.readFileSync('tests/index.html', 'UTF-8')

export default class Main extends ObjectiveAddon {

     constructor (content) {

          super(content)

     }

     init (callback) {

          Glob(PATH.resolve(PATH.join(__dirname, 'core', 'addons', '**', '*.js')), (error, content) => {
               if (error) throw error
               for (const file of content) {
                    import(file).then(value => {

                         const addon = value.default
                         this.create(new addon().export())

                         if (content.indexOf(file) + 1 === content.length) {
                              this.parse()
                              callback(this.built)
                         }

                    })
               }
          })
          
     }

}

new Main(content).init(built => {
     babel.transform(Beautify(built.join('')), {}, (error, result) => {
          if (error) throw error
          eval(Beautify(Uglify.minify(result.code).code))
     })
})