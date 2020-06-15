/*//////////////////////////////
         OBJECTIVE HTML
//////////////////////////////*/

export default class Print {

    get tagname () {
        return 'print'
    }

    onClose () {
        return ')\n'
    }

    onOpen  () {

        return 'console.log('
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