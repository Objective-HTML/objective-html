import Chai       from 'chai'
import Transpiler from '../core/transpiler'
import File       from '../core/file'

describe('#Transpiler', () => {
    it('should return a string', () => {
        new File('tests/html/sum.html').read().then(content => {
            Chai.expect(typeof new Transpiler(content).transpile()).to.eqls('string')
        })
    })
})