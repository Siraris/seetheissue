var issues = [];
var categories = [];

$(function() {
  // Load categories and populate them
  $.ajax({
    url: "/categories"
  }).done((data, status, xhr)=>{
      categories = JSON.parse(data);
      $.ajax({
        url: "/issues"
      }).done((data, status, xhr)=>{
        issues = JSON.parse(data);
        populateCategories(categories);
      });
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

  $('#uploadModal #category_id').on('change', (e) => {
    $('#issue-select__container').show();
    const issueSelect = $('#video_issue_id');
    issueSelect.html(""); // Reset issue container options
    issueSelect.append($("<option />").val(-1).text(""));
    for (let i = 0, len = issues.length; i < len; i++) {
      if (issues[i].category_id === parseInt($(e.currentTarget).val())) {
        issueSelect.append($("<option />").val(issues[i].id).text(issues[i].name));
      }
    }
  });

  $('#uploadModal #video_issue_id').on('change', (e) => {
    $('#second-upload__step').show();
  });
});

function populateCategories(categories) {
  const categoryArray = categories.map((category, index)=> {
    return `<div class="category__container">
    <div class="category" data-category-id="${category.id}">${category.name}
      <span class="plus">+</span>
      <span class="minus hidden">-</span>
    </div>
    <div class="issues hidden">${populateIssues(category.id)}</div>
    </div>`;
  });
  $('#categories').html(categoryArray.join(""));
  $('.category__container').on("click", (e)=>{
    const issueElements = $(e.currentTarget).children('.issues'),
    plus = $(e.currentTarget).find('.plus'),
    minus = $(e.currentTarget).find('.minus');
    if (issueElements.hasClass('hidden')) {
      issueElements.removeClass('hidden');
      plus.addClass('hidden');
      minus.removeClass('hidden');
    } else {
      issueElements.addClass('hidden');
      plus.removeClass('hidden');
      minus.addClass('hidden');
    }
  });
}

function populateIssues(categoryId) {
  const issueArray = issues.map((issue, index)=>{
    if (issue.category_id == categoryId) {
      return `<a href="/issues/${issue.id}" class="issue">${issue.name}</a>`;
    }
  });
  return issueArray.join("");
}

function showContent(content, button) {
  content.removeClass('hidden')
  button.html("Hide");
}


function hideContent(content, button) {
  content.addClass('hidden');
  button.html("Show");
}

