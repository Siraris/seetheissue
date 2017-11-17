class GEOService
  def initialize
    @base_uri = "search.mapzen.com/v1"
  end

  def query_geo_data(zipcode)
    options = {
      params: {
        api_key: "mapzen-zBXbDcz",
        postalcode: zipcode,
        country: "United States"
      }
    }

    begin
      response = RestClient.get(@base_uri + '/search/structured', options)
      if (response.code == 200)
        JSON.parse(response.body, object_class: OpenStruct)
      else
        nil
      end
    rescue Exception => e
      puts "Error encountered querying structured address info #{e.message}"
    end
  end
end
