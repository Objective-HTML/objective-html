/*//////////////////////////////
         OBJECTIVE HTML
            Printing
//////////////////////////////*/

export default class Print {

    get tagname () {
        return 'for'
    }

    onClose () {
        return '}'
    }

    onOpen (tag, index, attrs) {

        const iterator = attrs.filter(x => x.name === 'var')[0].value,
              array    = attrs.filter(x => x.name === 'in')[0].value

        return `for(var ${iterator.slice(1, iterator.length - 1)} of ${array.slice(1, array.length - 1)}) {`

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