const React = require('react')

const RenderMedia = require('./RenderMedia')
const { ControlGroup, Button, InputGroup } = require('@blueprintjs/core')
const { remote } = require('electron')

class Composer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      attachment: {},
      value: '',
      error: false
    }
    this.minimumHeight = 48
    this.defaultHeight = 17 + this.minimumHeight
    this.clearInput = this.clearInput.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
  }

  onKeyDown (e) {
    if (e.keyCode === 13 && e.shiftKey) {
      this.setState({ value: this.state.value + '\n' })
      e.preventDefault()
      e.stopPropagation()
    } else if (e.keyCode === 13 && !e.shiftKey) {
      this.sendMessage()
      e.preventDefault()
      e.stopPropagation()
    }
  }

  handleError () {
    this.setState({ error: true })
  }

  sendMessage () {
    if (!this.state.value) return this.handleError()
    this.props.onSubmit({
      attachment: this.state.attachment,
      text: this.state.value
    })
    this.clearInput()
  }

  clearInput () {
    this.setState({ value: '' })
  }

  handleChange (e) {
    this.setState({ value: e.target.value, error: false })
  }

  addAttachment () {
    var self = this
    var opts = {
      properties: ['openFile']
    }
    remote.dialog.showOpenDialog(opts, function (filenames) {
      if (filenames && filenames[0]) {
        console.log('updatind attachment', filenames[0])
        self.setState({ attachment: filenames[0] })
      }
    })
  }

  render () {
    const tx = window.translate
    const addAttachmentButton = (
      <Button minimal icon='paperclip' onClick={this.addAttachment.bind(this)} />
    )

    function getFilemime (url) {
      return 'image/jpg'
    }

    return (
      <ControlGroup className='composer' fill vertical={false}>
        {this.state.attachment && <RenderMedia
          url={this.state.attachment}
          filemime={getFilemime(this.state.attachment)}
          className='thumbnail'
        />
        }
        <InputGroup
          intent={this.state.error ? 'danger' : 'none'}
          large
          value={this.state.value}
          onKeyDown={this.onKeyDown.bind(this)}
          aria-label={tx('writeMessageAriaLabel')}
          onChange={this.handleChange}
          placeholder={tx('writeMessage')}
          rightElement={addAttachmentButton}
        />
        <Button onClick={this.sendMessage}>{tx('send')}</Button>
      </ControlGroup>
    )
  }
}

module.exports = Composer
