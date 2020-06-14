/*//////////////////////////////
         OBJECTIVE HTML
            Printing
//////////////////////////////*/

export default class Argument {

    get tagname () {
        return 'argument'
    }

    onClose () {

        return ','

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