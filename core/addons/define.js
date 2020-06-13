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
            return 'var ' + match + ' ='
        } else {
            return match + ' ='
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