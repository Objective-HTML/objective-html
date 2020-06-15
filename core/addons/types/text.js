/*//////////////////////////////
         OBJECTIVE HTML
//////////////////////////////*/

export default class Text {

    get tagname () {
        return 'text'
    }

    onClose () {
        return '`'
    }

    onOpen () {
        return '`'
    }

    onText (content) {

        return content

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