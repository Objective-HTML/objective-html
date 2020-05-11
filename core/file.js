/*//////////////////////////////
         OBJECTIVE HTML
              File
//////////////////////////////*/

import FS from 'fs'
import PATH from 'path'

export default class File {

     constructor (dir) {
          this.dir = dir
     }

     filewalker (done) {
          let results = []
      
          FS.readdir(this.dir, (err, list) => {
              if (err) return done(err)
      
              var pending = list.length
      
              if (!pending) return done(null, results)
      
              list.forEach(file => {
                  file = PATH.resolve(this.dir, file)
      
                  FS.stat(file, (err, stat) => {
                      if (stat && stat.isDirectory()) {
                          results.push(file)
                          this.filewalker(file, (err, res) => {
                              results = results.concat(res)
                              if (!--pending) done(null, results)
                          })
                      } else {
                          results.push(file)
      
                          if (!--pending) done(null, results)
                      }
                  })
              })
          })
      }

}
