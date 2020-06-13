/*//////////////////////////////
         OBJECTIVE HTML
             Addons
//////////////////////////////*/

import FS            from 'fs'
import PATH          from 'path'
import ObjectiveHTML from './parser'
import parse         from 'parse5'

export default class ObjectiveAddon extends ObjectiveHTML {

    constructor (content) {
        
        super(content)
        

    }

    load (callback) {

        FS.readdir(PATH.resolve(PATH.join(__dirname, 'addons')), (error, content) => {
            if (error) throw error
            
            for (const file of content) {
                import(PATH.resolve(PATH.join(__dirname, 'addons', file))).then(value => {
                    
                    const addon = value.default
                    this.create(new addon().export())

                    if (content.indexOf(file) + 1 === content.length) {
                        callback()
                    }

                })
            }
        })

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
                        let attributes = parse.parseFragment(data).childNodes[0].attrs.map(x => x = {name: x.name, value: x.value = '"' + x.value + '"'})
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