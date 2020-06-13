/*//////////////////////////////
         OBJECTIVE HTML
            Printing
//////////////////////////////*/

export default class Print {

    get tagname () {
        return 'item'
    }

    onClose () {
        return ', '
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