class VideoDetailsButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {showDetails: false};
  }

  handleClick(e) {
    this.setState({showDetails: !this.state.showDetails});
  }

  render () {
    return (
      <div>
        <button onClick={this.handleClick}>...</button>
        {this.state.showDetails ? <VideoDetails /> : null}
      </div>
    )
  }
}
