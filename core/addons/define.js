/*//////////////////////////////
         OBJECTIVE HTML
            Printing    
//////////////////////////////*/

const variables = []

export default class Print {

    get tagname () {
        return 'define'
    }

    onClose () {
        return ';'
    }

    onOpen  (tag, index, attrs) {

        const match = attrs.filter(x => x.name === 'name')[0].value
        if (!variables.includes(match)) {
            variables.push(match)
            return 'var ' + match.slice(1, match.length - 1) + ' ='
        } else {
            return match.slice(1, match.length - 1) + ' ='
        }
    }

    export () {
        
        return {
            tagName : this.tagname,
            onClose : this.onClose,
            onOpen  : this.onOpen ,
            onText  : this.onText ,
            inject  : this.inject
        }

    }

}