import Chai   from 'chai'
import Parser from '../core/parser'
import File   from '../core/file'



describe('#Parser', () => {

  it('should return an array', () => {
    new File('tests/html/sum.html').read().then(content => {
      Chai.expect(typeof new Parser(content).parse()).to.eqls('object')
    })
  })

})