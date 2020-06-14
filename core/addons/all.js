/*//////////////////////////////
         OBJECTIVE HTML
            Printing
//////////////////////////////*/

let stats = false

export default class All {

    get tagname () {
        return 'all'
    }

    onClose () {
        if (stats) {
            stats = false
            return ')'
        }
    }

    onOpen (tag, index, attrs, functions) {

        tag = tag.slice(1, tag.length - 1).trim()
        if (tag.endsWith('/')) tag = tag.slice(0, tag.length - 1).trim()
        if (functions.filter(x => x.value.slice(1, x.value.length - 1) === tag).length > 0) {
            stats = true
            return `${tag}(`
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