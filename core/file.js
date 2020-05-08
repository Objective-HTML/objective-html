/*//////////////////////////////
         OBJECTIVE HTML
              File
//////////////////////////////*/

import FS from 'fs'

export default class File {

     constructor (file) {
          this.file =  file
     }

     read () {

          return new Promise ((resolve, reject) => {
               FS.readFile(this.file, 'UTF-8', (error, content) => {
                    if (error) reject(error)
                    resolve(content)
               })
          })

     }

}