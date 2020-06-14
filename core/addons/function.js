/*//////////////////////////////
         OBJECTIVE HTML
            Printing
//////////////////////////////*/

const functions = []

export default class Function {

    get tagname () {
        return 'function'
    }

    onClose () {
        return '}'
    }

    onOpen (tag, index, attrs) {

        const name  = attrs.filter(x => x.name === 'name'),
              value = name[0].value.slice(1, name[0].value.length - 1),
              args  = attrs.slice(attrs.indexOf(name[0]) + 1)
                           .filter(x => x.value.replace(/"/g, '')
                           .trim().length === 0)
                           .map(x => x.name)

        if (!name) return
        functions.push(name)
        return `function ${value}(${args.join(', ')}){`

    }

    export () {

        return {
            tagName   : this.tagname,
            onClose   : this.onClose,
            onOpen    : this.onOpen ,
            onText    : this.onText ,
            inject    : this.inject ,
            functions : functions
        }

    }

}