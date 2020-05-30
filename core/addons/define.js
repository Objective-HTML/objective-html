/*//////////////////////////////
         OBJECTIVE HTML
            Printing    
//////////////////////////////*/

export default class Print {

    get tagname () {
        return 'define'
    }

    onClose () {
        console.log(';')
    }

    onOpen  (tag, index, attrs) {

        console.log('var', attrs.filter(x => x.name === 'name')[0].value, '=')
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