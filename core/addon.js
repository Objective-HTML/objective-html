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

        this.built  = []
        this.addons = []
        this.functions = []

    }

    load (callback) {

        FS.readdir(PATH.resolve(PATH.join(__dirname, 'addons')), (error, content) => {
            if (error) throw error
            
            for (const file of content) {
                if (!file.includes('all')) {
                    import(PATH.resolve(PATH.join(__dirname, 'addons', file))).then(value => {

                        const addon = value.default
                        this.create(new addon().export())

                        this.addons.push(addon.tagName)

                        if (content.indexOf(file) + 1 === content.length) {
                            callback()
                        }

                    })
                }
            }
        })

    }

    create (object = {
        tagName   : String   ,
        onOpen    : Function ,
        onClose   : Function ,
        onText    : Function ,
        inject    : Function ,
        functions : Array
    }) {

        if (typeof object !== 'object') return
        if (object.functions) this.functions = object.functions
        if (object.onClose) {
            if (typeof object.onClose === 'function') {
                this.on('close', (data, index) => {
                    if (data.startsWith('</' + object.tagName)) {
                        this.addons.push(data)
                        this.built.push(object.onClose(data, index))
                    } else if (object.tagName === 'all') {
                        this.built.push(object.onClose(data, index))
                    }
                })
            }
        }

        if (object.onOpen) {
            if (typeof object.onOpen === 'function') {
                this.on('open', (data, index) => {
                    let attributes = parse.parseFragment(data).childNodes[0].attrs.map(x => x = {name: x.name, value: x.value = '"' + x.value + '"'})
                    if (!attributes) attributes = []
                    if (data.startsWith('<' + object.tagName)) {
                        this.built.push(object.onOpen(data, index, attributes))
                    } else if (object.tagName === 'all') {
                        this.built.push(object.onOpen(data, index, attributes, this.functions.flat()))
                    }
                })
            }
        }
        
        if (object.onText) {
            if (typeof object.onText === 'function') {
                this.on('text', (data, index) => {
                    this.built.push(object.onText(data, index))
                })
            }
        }

        if (object.inject) {
            if (typeof object.inject === 'function') {
                const injectCode = object.inject()
                for (const code of injectCode) {
                    this.built.unshift(code)
                }
            }
        }
        
    }

}
