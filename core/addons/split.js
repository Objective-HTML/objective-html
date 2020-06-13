/*//////////////////////////////
         OBJECTIVE HTML
            Spliting
//////////////////////////////*/

const variables = []

export default class Split {

    get tagname () {
        return 'split'
    }

    onClose () {
        return ')'
    }

    onOpen  (tag, index, attrs) {

        const delimiters = attrs.filter(x => x.name === 'at'),
              delimiter  = delimiters[delimiters.length - 1]

        return `split(${delimiter.value}, `

    }

    inject () {

        return [
            'function split(delimiter,word){return word.split(delimiter);}'
        ]

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