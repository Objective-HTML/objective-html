/*//////////////////////////////
         OBJECTIVE HTML
            Spliting
//////////////////////////////*/

const variables = []

function split (delimiter, word) {

    return word.split(delimiter)
}

export default class Split {

    get tagname () {
        return 'split'
    }

    onClose () {
        console.log(')')
    }

    onOpen  (tag, index, attrs) {

        const delimiters = attrs.filter(x => x.name === 'at'),
              delimiter  = delimiters[delimiters.length - 1]

        console.log(`join(${delimiter.value}, `)

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