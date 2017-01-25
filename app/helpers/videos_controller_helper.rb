module VideosControllerHelper
  def video_embed_tag(id)
    return "//content.jwplatform.com/players/#{id}-z1GU7fGd.js"
  end
end
