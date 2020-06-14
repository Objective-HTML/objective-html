/*//////////////////////////////
         OBJECTIVE HTML
            Printing
//////////////////////////////*/

export default class Newline {

    get tagname () {
        return 'newline'
    }

    onOpen  () {

        return ' + \'\\n\' + '

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