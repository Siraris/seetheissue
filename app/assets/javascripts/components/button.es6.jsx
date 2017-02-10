export default class Button extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div onClick={() => {this.props.clickHandler()}}>Button</div>
    )
  }
}
