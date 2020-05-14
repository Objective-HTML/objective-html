/*//////////////////////////////
         OBJECTIVE HTML
             Parser
//////////////////////////////*/

import Lexer from './lexer'
export default class Parser {

    constructor (content = '') {

        this.lexer  = new Lexer(content).lexer()
        this.status = 'NONE'

    }

    parse () {
        if (typeof this.lexer !== 'object') throw new Error('Lexer content must be an object!')

        let   blck_index  = -1,
              blocks      = [],
              cur_block   = [],
              parse_blcks = new Map()
        let iterator = -1
        for (const item of this.lexer) {
            const elements = item[0].split(' | '),
                  letter   = elements[0],
                  index    = elements[1],
                  status   = item[1]

            if (status === 'BLOCK_START') {
                ++blck_index
                cur_block.push(letter)
            } 
            else if (status === 'SPACE' || status === 'BLOCK_CONTENT') cur_block.push(letter)
            else if (status === 'BLOCK_END') {
                cur_block.push(letter)
                blocks.push(cur_block.join(''))
                cur_block = []
            } else if (status === 'BLOCK_VALUE') {
                if (this.lexer.get(Array.from(this.lexer.keys())[iterator - 1]) !== 'BLOCK_VALUE') {
                    ++blck_index
                    cur_block.push(letter)
                } else if (this.lexer.get(Array.from(this.lexer.keys())[iterator + 2]) === 'BLOCK_START'){
                    cur_block.push(letter)
                    blocks.push(cur_block.join(''))
                    cur_block = []
                } else cur_block.push(letter)

            }

            ++iterator

        }
        
        for (const i of blocks) {

            if (i.trim()
                 .startsWith('<') && 
                i.trim()
                 .endsWith('>')) {

                let block_infos = new Map()

                if (i.slice(1, i.length - 1)
                     .trim()
                     .startsWith('/')) 
                     block_infos.set(i.slice(1, i.length - 1)
                                      .split(' ')
                                      .slice(0, 1)[0]
                                      .slice(1), 'END')

                else if (i.slice(1, i.length - 1)
                          .trim()
                          .endsWith('/')) 
                          block_infos.set(i.slice(1, i.length - 1)
                                           .split(' ')
                                           .slice(0, 1)[0]
                                           .endsWith('/') 
                                           ? i.slice(1, i.length - 1)
                                              .split(' ')
                                              .slice(0, 1)[0]
                                              .split('/')
                                              .join('') 
                                           : i.slice(1, i.length - 1)
                                              .split(' ')
                                              .slice(0, 1)[0], 'INLINE')

                else block_infos.set(i.slice(1, i.length - 1)
                                      .split(' ')
                                      .slice(0, 1)[0], 'START')

                let status        = 'NONE',
                    block_content = []

                i.slice(1, i.length - 1).trim().split('').forEach(char => {

                    if (status === 'STRING_END') status = 'NONE'
                    if (status === 'NONE' && char === ' ') char = '%%%'
                    if ((status === 'STRING_CONTENT' || 
                         status === 'STRING_CONTENT') && char === '"') status = 'STRING_END'
                    else if (status === 'STRING_START' || 
                             status === 'STRING_CONTENT') status = 'STRING_CONTENT'
                    else if (char === '"' && status !== 'STRING_CONTENT') status = 'STRING_START'

                    block_content.push(char)

                })

                const all = block_content.join('')
                                         .split('%%%')
                                         .slice(1)
                                         
                console.log({
                    block  : Array.from(block_infos.keys())[0],
                    id     : blocks.indexOf(i),
                    type   : Array.from(block_infos.values())[0],
                    params : all.filter(x => x.includes('='))
                               .map(x => x = {
                                   name: x.split('=')[0], 
                                   value: x.split('=')[1]
                                }),
                    args   : all.filter(x => !x.includes('=')),
                    all    : all
                })
                
            } else {
                console.log({
                    block : i,
                    id    : blocks.indexOf(i),
                    type  : 'TEXT'
                })
            }
        }
        
        

    }

}