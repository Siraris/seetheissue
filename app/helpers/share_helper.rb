module ShareHelper
  def share_button(options = {}, &block)
    options[:class] += " share__btn"
    content_tag(:a, capture(&block), options)
  end
end
