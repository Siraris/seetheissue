import IssueNavigator from 'components/issue_navigator.es6.jsx';
import VideoBox from 'components/video_box.es6.jsx';
import Button from 'components/button.es6.jsx';
import UploadForm from 'components/upload_form.es6.jsx';

export default class VideoIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: [],
      categories: [],
      issueNavVisibility: ""
    }
    this.toggleIssueNavigator = this.toggleIssueNavigator.bind(this);
  }

  componentDidMount() {
    $.ajax({
      url: "/videos"
    }).done((data, status, xhr)=>{
      this.setState({videos: JSON.parse(data)});
    });

    $.ajax({
      url: "/categories"
    }).done((data, status, xhr)=>{
      this.setState({categories: JSON.parse(data)});
    });
  }

  toggleIssueNavigator(e) {
    let visibility = (this.state.issueNavVisibility == "hidden") ? "" : "hidden"
    this.setState({issueNavVisibility: visibility});
  }

  render() {
    return (
      <div className="container">
        <Button onClick={this.toggleIssueNavigator} />
        <IssueNavigator visibility={this.state.issueNavVisibility} />
        <div className="row">
          <div className="col-md-12">
            <h1>This Rocks!</h1>
            <UploadForm authenticity_token={this.props.token} categories={this.state.categories} />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <VideoBox videos={this.state.videos}/>
          </div>
        </div>
      </div>
    )
  }
}
