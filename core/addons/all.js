/*//////////////////////////////
         OBJECTIVE HTML
            Printing
//////////////////////////////*/

export default class All {

    get tagname () {
        return 'all'
    }

    onClose () {
    }

    onOpen (tag, index, attrs) {

        console.log(tag)

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