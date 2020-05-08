/*//////////////////////////////
         OBJECTIVE HTML
             Lexer
//////////////////////////////*/

export default class Lexer {

    constructor (content = '') {

        this.posX    = -1
        this.posY    = 1
        this.status  = 'S_FREE'
        this.content = content

    }

    lexer () {

        if (this.content.length < 1) throw new Error('File content cannot be empty!')

    }

}