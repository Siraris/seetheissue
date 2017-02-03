export default class VideoPlayer extends React.Component {
  componentDidMount() {
    $('.holder').html(`<iframe src="//content.jwplatform.com/players/${this.props.video_id}-b6nlffuj.html" width="480" height="270" frameborder="0" scrolling="auto" allowfullscreen>`);
  }

  render() {
    return (
      <div className="holder">
        
      </div>
    )
  }
}
