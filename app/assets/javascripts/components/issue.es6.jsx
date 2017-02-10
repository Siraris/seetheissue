export default class Issue extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>{this.props.issue.name}</div>
    )
  }
}
