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
            tagName : this.tagname ?? undefined,
            onClose : this.onClose ?? undefined,
            onOpen  : this.onOpen  ?? undefined,
            onText  : this.onText  ?? undefined,
            inject  : this.inject  ?? undefined
        }

    }

}