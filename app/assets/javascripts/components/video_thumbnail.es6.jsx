const jwUrl = "http://content.jwplatform.com/thumbs/";
const sizes = {
  small: "360",
  medium: "480",
  large: "720"
}

class VideoThumbnail extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // Should display the video popup with the containing video
  }

  render () {
    let thumbnailUrl = `${jwUrl + this.props.id}-${sizes[this.props.size]}.jpg`
    return (
      <div onClick={this.handleClick}>
        <VideoDetailsButton />
        <img src={thumbnailUrl} />
      </div>
    )
  }
}

