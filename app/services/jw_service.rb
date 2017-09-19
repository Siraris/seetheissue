# Service to consume JWPlayer hosted video
# API
class JWService
  def initialize
    @base_uriv1 = "api.jwplatform.com/v1"
    @base_uriv2 = "api.jwplayer.com/v2"
  end

  # Creates a temporary video link on JWPlatform
  # that is used to directly upload a video from the users
  # device as opposed to routed through our server
  def create_video(params)
    # Useful params?
    # title, tags, author
    options = {
                params: {
                  upload_method: "s3",
                  upload_content_type: params[:video][:content].content_type
                }
              }

    options[:params] = options[:params].merge!(api_settings(options[:params]))

    begin
      response = RestClient.get(@base_uriv1 + '/videos/create', options)
      if (response.code == 200)
        JSON.parse(response.body, object_class: OpenStruct)
      end
    rescue Exception => e
      puts e.message
    end
  end

  # Returns the number of plays for all media_ids
  def plays(page = 0)
    video_url = "https://#{@base_uriv2}/sites/#{ENV.fetch('JW_API_KEY')}/analytics/queries/"
    begin
      response = RestClient.post(video_url, {start_date: "2017-01-01", end_date: "2017-09-15",
          dimensions: ["media_id"], page: page, metrics: [{operation: "sum", field: "plays"}], sort: [{field: "plays", order: "DESCENDING"}]
        }.to_json, :authorization => ENV.fetch('JW_API_REPORTING_SECRET'), :content_type => "application/json"
        )

      if (response.code == 200)
        JSON.parse(response.body, object_class: OpenStruct)
      end
    rescue Exception => e
      puts e.response
    end
  end

  def upload_video(body, params)
    video_url = build_video_url(body.link)

    begin
      response = RestClient.put(video_url, File.new(params[:video][:content].path, 'rb'),
       :content_disposition => 'attachment; filename='+params[:video][:content].original_filename,
       :content_type => params[:video][:content].content_type,
       :content_length => File.size(params[:video][:content].path.to_s))

      # Return ID of video
      return body.media.key
    rescue Exception => e
      puts e.response
    end
  end


  private
    # Builds the appropriate API settings to interact with JWPlatform
    # The signature is generated using OAauth core 1.0 specification
    def api_settings(options)
      settings = {
       api_format: "json",
       api_key: ENV.fetch('JW_API_KEY'),
       api_nonce: rand.to_s[3..10],
       api_timestamp: DateTime.now.to_time.to_i
     }

     signature = settings.merge(options).sort.to_h.to_query + ENV.fetch('JW_API_SHARED_SECRET')
     settings[:api_signature] = Digest::SHA1.hexdigest(signature)
     return settings
    end

    # Builds out the appropriate URI to upload a user created video
    # directly to the JWPlatform transcoder
    def build_video_url(link)
      video_url = "#{link.protocol}"
      video_url += "://"
      video_url += "#{link.address}"
      video_url += "#{link.path}?"
      video_url += link.query.to_h.to_query
      return video_url
    end
end
