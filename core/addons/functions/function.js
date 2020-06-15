/*//////////////////////////////
         OBJECTIVE HTML
//////////////////////////////*/

export default class Function {

    get tagname () {
        return 'function'
    }

    onClose () {
        return '}\n'
    }

    onOpen (tag, index, attributes) {

        const name_opt = attributes.filter(x => x.name === 'name')[0],
              name     = name_opt.value.slice(1, name_opt.value.length - 1),
              args     = attributes.filter(x => x !== name && x.value.replace(/"/g, '').trim().length === 0).map(x => x.name)

        return `function ${name}(${args.join(',')}){`

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