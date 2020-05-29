/*//////////////////////////////
         OBJECTIVE HTML
              Main
//////////////////////////////*/

import FS            from 'fs'
import PATH          from 'path'
import ObjectiveAddon from './core/addon'

const content = FS.readFileSync('tests/index.html', 'UTF-8')


export default class Main extends ObjectiveAddon {

     constructor (content) {

          super(content)

     }

     init () {
          
          FS.readdir(PATH.resolve(PATH.join(__dirname, 'core', 'addons')), 'UTF-8', (error, content) => {
               if (error) throw error
               if (content.length < 1) return
               for (const file of content) {
                    import(PATH.resolve(PATH.join(__dirname, 'core', 'addons', file))).then(value => {
                    
                         const addon = value.default
                         this.create(new addon().export())
     
                         if (content.indexOf(file) + 1 === content.length) {
                             this.parse()
                         }
     
                     })
               }
          })
          
     }

}

new Main(content).init()