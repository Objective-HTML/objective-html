/*//////////////////////////////
         OBJECTIVE HTML
//////////////////////////////*/

export default class Function {

    get tagname () {
        return 'function'
    }

    onOpen (tag, index, attributes) {

        console.log(attributes)
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