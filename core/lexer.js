/*//////////////////////////////
         OBJECTIVE HTML
             Lexer
//////////////////////////////*/

export default class Lexer {

    constructor (content = '') {

        this.posX    = 0
        this.status  = 'NONE'
        this.content = content
        this.index   = 0

    }

    lexer () {

        if (this.content.length < 1) throw new Error('File content cannot be empty!')

        const inline_code = this.content.split(/\r?\n/g)
                                        .map(x => x.trim())
                                        .filter(x => x !== '')
                                        .join('')
        const code_status = new Map()
        for (const i in inline_code) {

            if (this.status === 'SPACE' && inline_code[i] !== ' ') this.status = 'BLOCK_CONTENT'
            if (this.status === 'BLOCK_CONTENT' && inline_code[i] === ' ') this.status = 'SPACE'
            if (this.status === 'BLOCK_END') this.status = 'BLOCK_VALUE'

            if ((this.status === 'BLOCK_CONTENT') && inline_code[i] === '>') this.status = 'BLOCK_END'
            if (this.status === 'BLOCK_CONTENT' || this.status === 'BLOCK_START') this.status = 'BLOCK_CONTENT'
            if (inline_code[i] === '<') this.status = 'BLOCK_START'
            if ((this.status !== 'BLOCK_CONTENT') && inline_code[i] === '<' && inline_code[parseInt(i) + 1] === '!' && inline_code[parseInt(i) + 2] === '-' && inline_code[parseInt(i) + 3] === '-') this.status = 'COMMENT'

            code_status.set(inline_code[i] + ' | ' + i, this.status)

        }

        return code_status

    }

}