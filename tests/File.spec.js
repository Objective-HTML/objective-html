import Chai from 'chai'
import File from '../core/file'
describe('#File', () => {

  it('should return file content', () => {
    new File('tests/html/sum.html').read().then(content => {
      Chai.expect(content).to.not.equal(undefined)
    }) 
  })

  it('should throw an error if file does not exist', () => {
    new File('tests/html/index.html').read().catch(error => {
      Chai.expect(() => rror).to.throw(Error)
    })
  })

  it('should return default value if file is empty', () => {
    new File('tests/html/empty.html').read().then(content => {
      Chai.expect(content).to.be.equal('')
    })
  })

})