/*//////////////////////////////
         OBJECTIVE HTML
//////////////////////////////*/

export default class Variable {

    get tagname () {
        return 'variable'
    }

    onClose () {
        return '}'
    }

    onOpen () {

        return '${'

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