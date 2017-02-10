export default class Category extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div className="category" onClick={() => {this.props.clickHandler(this)}}>{this.props.category.name}</div>
    )
  }
}
