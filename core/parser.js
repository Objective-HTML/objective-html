/*//////////////////////////////
         OBJECTIVE HTML
             Parser
//////////////////////////////*/

export default class ObjectiveHTML extends ObjectiveEmitter {

    constructor (content) {

        super()
        this.content = content.split(/\r?\n/g)
                              .map(x => x.trim())

    }

    async makeAST (item, index) {

        if (item) {

            if (item.match(/<[^\/].*?>/g)) this.emit('open', item.match(/<[^\/].*?>/g)[0], index)
            if (/<.*?>(.*?)<\/.*?>/.exec(item)) this.emit('text', /<.*?>(.*?)<\/.*?>/.exec(item)[1], index)
            if (item.match(/^(?:(?!<.*?>).)*$/gm)) this.emit('text', item.match(/^(?:(?!<.*?>).)*$/gm)[0], index)
            if (item.match(/<\/.*?>/g)) this.emit('close', item.match(/<\/.*?>/g)[0], index)
            
            this.makeAST(this.content[index + 1], index + 1)

        }

    }

    async parse () {
        this.makeAST(this.content[0], 0) 
    }

}
