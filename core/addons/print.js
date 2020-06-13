/*//////////////////////////////
         OBJECTIVE HTML
            Printing    
//////////////////////////////*/

export default class Print {

    get tagname () {
        return 'print'
    }

    onClose () {
        return ');'
    }

    onOpen  () {

        return 'console.log('
    }

    export () {
        
        return {
            tagName : this.tagname ?? undefined,
            onClose : this.onClose ?? undefined,
            onOpen  : this.onOpen  ?? undefined,
            onText  : this.onText  ?? undefined,
            inject  : this.inject  ?? undefined
        }

    }

}