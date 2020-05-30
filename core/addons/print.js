/*//////////////////////////////
         OBJECTIVE HTML
            Printing    
//////////////////////////////*/

export default class Print {

    get tagname () {
        return 'print'
    }

    onClose (tag) {
        console.log(')')
    }

    onOpen  (tag, attributes) {

        console.log('console.log(')
    }

    export () {
        
        return {
            tagName : this.tagname ?? undefined,
            onClose : this.onClose ?? undefined,
            onOpen  : this.onOpen  ?? undefined,
            onText  : this.onText  ?? undefined
        }

    }

}