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

        let   blck_index  = 0,
              blocks      = [],
              parse_blcks = new Map()


        for (const i of this.lexer) {
            const element    = i[0].split('|')
                                   .map(x => x.trim())
                                   .map(x => x === '' ? x = ' ' : x),
                  char       = element[0],
                  content    = i[1]
            switch (content) {
                case 'BLOCK_START': {
                    blocks.push([])
                    blocks[blck_index].push(char)
                    this.status = 'BLOCK_START'
                    break
                }

                case 'BLOCK_CONTENT': {
                    if (this.status === 'BLOCK_START' || this.status === 'BLOCK_CONTENT') {
                        blocks[blck_index].push(char)
                        this.status = 'BLOCK_CONTENT'
                    }
                    break
                }
                
                case 'BLOCK_TEXT': {
                    if (this.status === 'BLOCK_TEXT') {
                        blocks[blck_index - 1].push(char)
                        this.status = 'BLOCK_TEXT'

                    } else if (this.status === 'BLOCK_END') {
                        ++blck_index
                        blocks.push([])
                        blocks[blck_index - 1] = []
                        blocks[blck_index - 1].push(char)
                        this.status = 'BLOCK_TEXT'
                    }
                    break
                }

                case 'BLOCK_VARIABLE': {
                    if (this.status === 'BLOCK_VARIABLE') {
                        blocks[blck_index - 1].push(char)
                        this.status = 'BLOCK_VARIABLE'

                    } else if (this.status === 'BLOCK_END') {
                        ++blck_index
                        blocks.push([])
                        blocks[blck_index - 1] = []
                        blocks[blck_index - 1].push(char)
                        this.status = 'BLOCK_VARIABLE'
                    }
                    break
                }
                case 'BLOCK_VARIABLE_END': {
                    blocks[blck_index - 1].push(char)
                    break
                } 

                case 'BLOCK_END': {
                    if (this.status === 'BLOCK_CONTENT' || this.status === 'BLOCK_START') {
                        blocks[blck_index].push(char)
                        this.status = 'BLOCK_END'
                        ++blck_index
                    }
                    break
                }
            }
        }
        
        blocks.map(x => x.join(''))
              .map((x, index) => x.startsWith('<') && x.endsWith('>') ? x[1] == '/' ?  parse_blcks.set(index + '_' + x, 'BLOCK_CLOSE') : parse_blcks.set(index + '_' + x, 'BLOCK_OPEN') : x.startsWith('{') && x.endsWith('}') ? parse_blcks.set(index + '_' + x, 'VARIABLE') : parse_blcks.set(index + '_' + x, 'TEXT'))

        const blcks_lst = []

        for (const i of parse_blcks) {

            const element   = i[0].split('_'),
                  index     = parseInt(element[0]),
                  item      = element[1],
                  status    = i[1]
            let   id        = '',
                  args      = [],
                  params    = [],
                  variables = [],
                  param_map = [],
                  block     = '',
                  all       = []
            if (status === 'BLOCK_OPEN' || status === 'BLOCK_CLOSE') {

                if (item.includes('<!--') && item.includes('-->')) {

                    block = item
                    id    = 'COMMENT'

                } else {

                    block = item.slice(1, item.length - 1)

                    if (block.startsWith('/')) {

                        block = block.slice(1)
                                     .split(' ')[0]
                        id    = block.toUpperCase() + '_END'
                        
                    } else {

                        id    = block.split(' ')[0]
                                     .toUpperCase() + '_START'

                    }

                    args      = block.split(' ')
                                     .slice(1)
                                     .join(' ')
                                     .trim()
                                     .split(' ') || []
                    args.map(x => x.includes('=') ? params.push(x) : variables.push(x))
                    args.map(x => all.push(x))
                    params.map(x => param_map.push({name: x.split('=')[0], value: x.split('=')[1]
                                                                                   .replace(/\"|\'/g, '')}))
                    block     = block.split(' ')[0]
                }

                blcks_lst.push({ block: block, id: index, type: id, args: variables, parameters: param_map, all: all })

            } else if (status === 'TEXT' || status === 'VARIABLE') {

                blcks_lst.push({ 
                    block: item, 
                    id: index, 
                    type: status 
                })

            }
        }
        console.log(blcks_lst)
        return blcks_lst

    }

}