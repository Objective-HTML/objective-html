/*//////////////////////////////
         OBJECTIVE HTML
//////////////////////////////*/

export default class Text {

    get tagname () {
        return 'text'
    }

    onClose () {
        return '`'
    }

    onOpen () {
        return '`'
    }

    onText (content) {

        return content

        //if (content.match(/{.*?}/g)) {
        //    const matches = content.match(/{.*?}/g)
        //    if (matches.length > 1) {
        //        for (const match of matches) {
        //            content = content.replace(match, '$' + match)
        //        }
        //        return '`' + content + '`'
        //    } else if (matches[0].length === content.length) {
        //        return content.slice(1, content.length - 1)
        //    } else {
        //        for (const match of matches) {
        //            content = content.replace(match, '$' + match)
        //        }
        //        return '`' + content + '`'
        //    }
        //} else {
        //    return '\'' + content + '\''
        //}

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