import VideoThumbnail from 'components/video_thumbnail.es6.jsx';
import Popup from 'components/pop_up.es6.jsx';

export default class VideoBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      videos: this.props.videos,
      showPopup: false
    }
    this.togglePopup = this.togglePopup.bind(this);
  }

  togglePopup(e) {
    this.setState({showPopup: !this.state.showPopup});
  }

  render() {
    let videos = this.props.videos.map((video, index) => {
      return <VideoThumbnail key={index} togglePopup={this.togglePopup} id={video.media_id} size="medium" />;
    });

    return (
      <div>
        <div>{videos}</div>
        {this.state.showPopup ? <Popup videos={this.state.videos} togglePopup={this.togglePopup} /> : null}
      </div>
    )
  }
}
