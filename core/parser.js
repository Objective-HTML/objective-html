/*//////////////////////////////
         OBJECTIVE HTML
             Parser
//////////////////////////////*/

import ObjectiveEmitter from './events'

export default class ObjectiveHTML extends ObjectiveEmitter {

    constructor (content) {

        super()
        this.content = [content.split(/\r?\n/g)
                              .map(x => x.trim())
                              .filter(x => x !== '')
                              .join('')]
        this.context = 'NONE'
        this.lexer   = new Map()

    }

    readHTML (index) {
        if (!this.content[index]) return
        const line = [...this.content[index]]

        for (const char_index in line) {

            const char = line[char_index]

            if (!['BLOCK_CONTENT', 'BLOCK_START'].includes(this.context) && ['TEXT', 'BLOCK_END', 'NONE'].includes(this.context)) this.context = 'TEXT'

            if (char === '<' && ['NONE', 'TEXT', 'BLOCK_END', 'SPACE'].includes(this.context)) this.context = 'BLOCK_START'
            if (!['<', '>'].includes(char) && ['BLOCK_START', 'BLOCK_CONTENT'].includes(this.context)) this.context = 'BLOCK_CONTENT'
            if (char === '>' && ['BLOCK_CONTENT', 'BLOCK_START'].includes(this.context)) this.context = 'BLOCK_END'

            this.lexer.set(`${char}::${char_index}`, this.context)
        }

        this.readHTML(index + 1)

    }

    parse () {

        this.readHTML(0)

        let element = [],
            built   = []

        for (const el of this.lexer) {

            const value   = el[0].split('::'),
                  context = el[1],
                  char    = value[0]


            switch (context) {

                case 'BLOCK_START': {
                    built.push(element)
                    element = []
                    element.push(char)
                    break
                }

                case 'BLOCK_CONTENT': {
                    element.push(char)
                    break
                }

                case 'BLOCK_END': {
                    element.push(char)
                    built.push(element)
                    element = []
                    break
                }

                case 'TEXT': {
                    element.push(char)
                    break
                }

            }

        }

        built = built.map(x => x.join('')).filter(x => x !== '')

        const result = new Map()

        for (const index in built) {

            const el = built[index]

            if (el.trim().startsWith('</')) {

                this.emit('close', el, index)

            } else if (el.trim().startsWith('<')) {

                if (el.trim().endsWith('/>')) {
                    this.emit('open', el, index)
                } else {
                    this.emit('open', el, index)
                }

            } else {
                this.emit('text', el, index)
            }

        }

    }


}
