$(document).ready(function () {
  "use strict";
  
  // Form logic
  $('.form-inline').submit(function (event) {
    var titleInput, nameInput, suggestion, valid = true;
    
    // Remove any error styles and alerts
    $(".form-group").removeClass("has-error");
    $(".alert").remove();
    
    // Get data from the form elements
    titleInput = $("#titleInput").val();
    nameInput = $("#nameInput").val();
    
    // Helper function for adding alerts
    function addErrorAlert(errorMessage) {
      //TODO: add a hidden div to the titles.haml file and clone it with jQuery instead of having all this HTML in here
      var alertDiv = '<div class="alert alert-danger alert-dismissable" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Error!</strong> ' + errorMessage + '</div>';
      $(".suggestion-form").prepend(alertDiv);
    }
    
    // Helper function for adding error style
    function addErrorStyle(jQuerySelector) {
      $(jQuerySelector).parent().addClass("has-error");
    }
    
    // Called when the AJAX call returns success
    function suggestionSuccessCallback(response) {
      // Some code to refresh the page
      alert("woo");
    }
    
    // Called when the AJAX call returns with an error
    function suggestionErrorCallback(response) {
      // Add alerts at the top og the page for errors returned from the server
      // console.log(response.responseJSON.errors);
      response.responseJSON.errors.forEach(function (message,index,arr) {
        addErrorAlert(message);
      });
    }
    
    // If the title is empty
    if (!titleInput || titleInput === "") {
      addErrorStyle("#titleInput");
      addErrorAlert("Title can't be blank");
      valid = false;
    }
    
    // If name is empty
    if (!nameInput || nameInput === "") {
      addErrorStyle("#nameInput");
      addErrorAlert("name can't be blank");
      valid = false;
    }
    
    // If we encountered any validation errors, stop right here
    if(!valid) {
      return;
    }
    
    // Build the suggestion object
    suggestion = {"name":nameInput, "title":titleInput};
    
    $.ajax({
      url: 'vote',
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(suggestion),
      success: suggestionSuccessCallback,
      error: suggestionErrorCallback
    }); // AJAX call
  }); // Form submit callback
  
  $('button').click(function (event) {
    // set up
    var titleId, element, votes;

    // save the id of the button, this is also the id of the title to vote for
    titleId = event.target.id;

    // This line makes it easier to interact with the DOM element that fired the
    // event, by converting it to a jQuery object
    element = $(this);

    // Set the cookie json flag (automagically parses and serializes JSON data)
    // and get the votes cookie
    $.cookie.json = true;
    votes = $.cookie('votes');

    // If the votes cookie is undefined, make votes an empty object
    if (!votes) {
      votes = {};
    }

    // If we have already voted for this title, return from the function
    if (votes[titleId]) {
      return;
    }

    // Set the vote and save the votes cookie
    votes[titleId] = true;
    $.cookie('votes', votes);

    // This get's called when the ajax call below returns successfully, it 
    // updates the votes in the table with the latest data from the server
    function upvoteSuccessCallback(jsonData) {

      // Locate the votes cell in the table
      element.parent().siblings('.votes').text(jsonData.votes);
    }

    // This ajax call votes for our favorite title and gets the new vote count 
    // from the server
    $.ajax({
      url: 'vote/' + event.target.id,
      type: 'POST',
      success: upvoteSuccessCallback
    }); // ajax
  }); // click event
}); // ready event