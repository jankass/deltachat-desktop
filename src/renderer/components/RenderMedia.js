const React = require('react')

class RenderMedia extends React.Component {
  render () {
    var { className, url, contentType } = this.props
    if (!contentType) contentType = 'image/jpg'
    let elm = <div />
    // TODO: there must be a stable external library for figuring out the right
    // html element to render
    if (contentType) {
      switch (contentType.split('/')[0]) {
        case 'image':
          elm = <img className={className} src={url} />
          break
        case 'audio':
          elm = <audio className={className} src={url} controls='true' />
          break
        case 'video':
          elm = <video className={className} src={url} controls='true' />
          break
        default:
          elm = <iframe className={className} width='100%' height='100%' src={url} />
      }
    }
    return elm
  }
}

module.exports = RenderMedia
