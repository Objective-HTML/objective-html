/*//////////////////////////////
         OBJECTIVE HTML
            Printing
//////////////////////////////*/

const variables = []

export default class Join {

    get tagname () {
        return 'join'
    }

    onClose () {
    }

    onOpen  (tag, index, attrs) {


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