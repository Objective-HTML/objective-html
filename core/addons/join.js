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
        console.log(';')
    }

    onOpen  (tag, index, attrs) {

        const match = attrs.filter(x => x.name === 'name')[0].value
        if (!variables.includes(match)) {
            console.log('var', match, '=')
            variables.push(match)
        } else {
            console.log(match, '=')
        }
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