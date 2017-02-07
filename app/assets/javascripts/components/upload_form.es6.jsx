export default class UploadForm extends React.Component {
  constructor() {
    super();
  }

  render() {
    this.props.categories.unshift({id: "", name: ""});
    const options = this.props.categories.map((category, index)=> {
      return <option key={index} value={category.id}>{category.name}</option>
    });
    return (
      <form className="new_video" id="new_video" encType="multipart/form-data" data-remote="true" action="/videos" acceptCharset="UTF-8" method="post">
        <input name="authenticity_token" type="hidden" value={this.props.authenticity_token} />
        <input accept="video/*;capture=camcorder" type="file" name="video[content]" id="video_content" />
        <select name="video[category_id]" id="video_category_id">
          {options}
        </select>
        <input type="submit" name="commit" value="Create Video" />
      </form>)
  }
}
