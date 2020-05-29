/*//////////////////////////////
         OBJECTIVE HTML
             Events
//////////////////////////////*/

export default class ObjectiveEmitter {

    constructor () {
        this.handlers = {}
    }

    on (event, handler) {
        this.handlers[event] = this.handlers[event] || []
        let hdl = this.handlers[event]
        hdl.push(handler)
        return this
    }

    emit (event, ...args) {
        this.handlers[event] = this.handlers[event] || []
        let hdl = this.handlers[event]
        hdl.forEach(it => {
            it.apply(this, args)
        })
        return this
    }

}