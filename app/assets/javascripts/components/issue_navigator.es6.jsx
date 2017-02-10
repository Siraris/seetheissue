import Button from 'components/button.es6.jsx';
import Category from 'components/category.es6.jsx';
import Issue from 'components/issue.es6.jsx';

export default class IssueNavigator extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      issues: [],
      categoriesVisible: true
    }
    this.handleCategoryClick = this.handleCategoryClick.bind(this);
    this.handleIssueClick = this.handleIssueClick.bind(this);
    this.handleReturnToCategoriesClick = this.handleReturnToCategoriesClick.bind(this);
  }

  handleCategoryClick(e) {
    this.setState({
      issues: this.props.issues.filter((issue) => {
        return issue.category_id == e.props.category.id;
      })
    });
    this.toggleCategoryVisibility();
  }

  handleIssueClick(e) {

  }

  handleReturnToCategoriesClick(e) {
    this.toggleCategoryVisibility();
    this.resetIssues();
  }

  toggleCategoryVisibility() {
    this.setState({categoriesVisible: !this.state.categoriesVisible});
  }

  resetIssues() {
    this.setState({issues: []});
  }

  render() {
    return (
    <div>
      <div id="issuenavigator" className={this.props.visibility}>
        <div onClick={() => {this.handleReturnToCategoriesClick()}}>Return to Categories</div>
        <h1>Issue Navigator</h1>
        <div id="categories">
          {this.state.categoriesVisible && this.props.categories.map((category, index) => {
              return <Category key={index} category={category} clickHandler={this.handleCategoryClick} />
            })
          }
        </div>

        {
          this.state.issues.map((issue, index) => {
            return <Issue key={index} issue={issue} clickHandler={this.handleIssueClick} />
          })
        }
      </div>
    </div>)
  }
}
