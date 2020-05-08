import Assert from 'assert'
import File from '../core/file'

describe('#File', () => {

  it('should return file content', () => {
    new File('tests/sum.html').read().then(content => {
      Assert.notEqual(content, undefined)
    }) 
  })

  it('should throw an error if file does not exist', () => {
    new File('tests/index.html').read().catch(error => {
      Assert.notEqual(error, undefined)
    })
  })

  it('should return default value if file is empty', () => {
    new File('tests/empty.html').read().then(content => {
      Assert.equal(content, '')
    })
  })

})