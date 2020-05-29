/*//////////////////////////////
         OBJECTIVE HTML
             Addons
//////////////////////////////*/

import ObjectiveHTML from './parser'

export default class ObjectiveAddon extends ObjectiveHTML {

    constructor (content) {
        
        super(content)
        
    }

    create (object = {
        tagName : String,
        onOpen  : Function,
        onClose : Function,
        onText  : Function
    }) {

        if (typeof object !== 'object') return

        if (object.onClose) {
            if (typeof object.onClose === 'function') {
                this.on('close', (data, index) => {
                    if (data.startsWith('</' + object.tagName)) {
                        object.onClose(data, index)
                    }
                })
            }
        }

        if (object.onOpen) {
            if (typeof object.onOpen === 'function') {
                this.on('open', (data, index) => {
                    if (data.startsWith('<' + object.tagName)) {
                        const attributes = parse.parseFragment(data).childNodes[0].attrs
                        if (!attributes) attributes = []
                        object.onOpen(data, index, attributes)
                    }
                })
            }
        }
        
        if (object.onText) {
            if (typeof object.onText === 'function') {
                this.on('text', (data, index) => {
                    object.onText(data, index)
                })
            }
        }
        
    }

}