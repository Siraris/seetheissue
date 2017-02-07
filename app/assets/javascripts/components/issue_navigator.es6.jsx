import Button from 'components/button.es6.jsx';

export default class IssueNavigator extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
    <div>
      <div id="issuenavigator" className={this.props.visibility}>
        <h1>ISSUES</h1>
      </div>
    </div>)
  }
}
