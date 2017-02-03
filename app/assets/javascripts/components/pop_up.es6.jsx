import VideoPlayer from 'components/video_player.es6.jsx';

export default class Popup extends React.Component {
  render () {
    return (
      <div className="video popup">
        <button onClick={this.props.togglePopup}>Close</button>
        <VideoPlayer video_id="Fg9ce88q" />
      </div>
    )
  }
}

