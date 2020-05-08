import Chai   from 'chai'
import File   from '../core/file'
import Lexer  from '../core/lexer'

describe('#Lexer', () => {
  
  it('should return error if file is empty', () => {

    Chai.expect(() => new Lexer().lexer()).to.throw(Error)

  })

  it('should return a map', () => {
    new File('tests/html/sum.html').read().then(content => {
      Chai.expect(typeof new Lexer(content).lexer()).to.eqls('object')
    })
  })

})