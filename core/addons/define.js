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
            tagName : this.tagname ?? undefined,
            onClose : this.onClose ?? undefined,
            onOpen  : this.onOpen  ?? undefined,
            onText  : this.onText  ?? undefined,
            inject  : this.inject  ?? undefined
        }

    }

}