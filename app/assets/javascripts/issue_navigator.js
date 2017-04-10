var issues = [];

$(function() {
  // Load categories and populate them
  $.ajax({
    url: "/categories"
  }).done((data, status, xhr)=>{
    populateCategories(JSON.parse(data));
  });

  $.ajax({
    url: "/issues"
  }).done((data, status, xhr)=>{
    issues = JSON.parse(data);
  });

  $('#category-return__btn').on("click", (e)=>{
    $('#categories').show();
    $('#issues').html(null);
  });

  $('#toggle-issue-nav__btn').on('click', (e)=>{
    const content = $('#issue-navigator #issue-content');
    (content.hasClass('hidden'))
      ? showContent(content, $(e.currentTarget))
      : hideContent(content, $(e.currentTarget));
  });

  $('#issue-navigator').on('mouseleave', (e) => {
    $(e.currentTarget).toggle();
  });
});

function populateCategories(categories) {
  const categoryArray = categories.map((category, index)=> {
    return `<div class="category" data-category-id="${category.id}">${category.name}</div>`;
  });
  $('#categories').html(categoryArray.join(""));
  $('.category').on("click", (e)=>{
    populateIssues($(e.currentTarget).data("category-id"));
  });
}

function populateIssues(categoryId) {
  const issueArray = issues.map((issue, index)=>{
    if (issue.category_id == categoryId) {
      return `<a href="/issues/${issue.id}" class="issue">${issue.name}</a>`;
    }
  });
  $('#issues').html(issueArray.join(""));
  $('#categories').hide();
}

function showContent(content, button) {
  content.removeClass('hidden')
  button.html("Hide");
}


function hideContent(content, button) {
  content.addClass('hidden');
  button.html("Show");
}

