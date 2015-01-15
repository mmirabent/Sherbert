$(document).ready(function () {
  "use strict";
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