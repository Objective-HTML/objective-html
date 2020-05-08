import Chai   from 'chai'
import File   from '../core/file'
import Lexer  from '../core/lexer'

describe('#Lexer', () => {
  
  it('should return error if file is empty', () => {

    Chai.expect(() => new Lexer().lexer()).to.throw(Error)

  })


})