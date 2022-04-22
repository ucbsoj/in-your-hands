/**************************
jQuery Choose-Your-Own-Adventure by Jeremy Rue https://github.com/jrue

LICENSE: CC BY-NC-SA Attribution-NonCommercial-ShareAlike

You are free to remix, adapt, and build upon this work non-commercially, as long as you credit me and license the new creations under the identical terms. 

https://creativecommons.org/licenses/by-nc-sa/4.0/
**************************/


(function( $ ){
  $.chooseYourOwnAdventure = function(el, data, options){

    var base = this;

    // Access to jQuery and DOM versions of element
    base.$el = $(el);
    base.el = el;
    

    // Add a reverse reference to the DOM object
    base.$el.data("chooseYourOwnAdventure", base);

    base.init = function(){
      
      base.options = $.extend({},$.chooseYourOwnAdventure.defaultOptions, options);
      
      base.data = data;

      jQuery.extend( jQuery.easing, {easeOutCubic: function (x, t, b, c, d) {
        return c*((t=t/d-1)*t*t + 1) + b;
    }});
       
    }; 
    
    base.createQuestion = function(d, first){
      
      let questionHolder = $("<div />")
        .addClass("card my-3 active")
        .css({"background-color":"transparent","color":"black","border":"none"})
        .attr("data-adventure-id", d.id);
      

      let questionBody = $("<div />")
        .addClass("card-body");
      
      let explanation = $("<div />")
        .addClass("alert alert-info explanation mt-3")
        .text(d.explanation);
      
      if(d.audio !== ""){
        $("<audio />")
          .addClass("mt-4")
          .attr("src", d.audio)
          .attr("type","audio/mp3")
          .attr("width", "100%")
          .appendTo(explanation);
        
      }

      if(d.image !== ""){
        $("<img />")
          .attr("src", d.image)
          .addClass("img-fluid d-block mx-auto w-50")
          .appendTo(questionHolder);
      }

      if(d.title !== ""){
        $("<h3 />").addClass("card-title").text(d.title).appendTo(questionBody);
      }

      if(d.prompt !== ""){
        $("<p />").addClass("card-text").text(d.prompt).appendTo(questionBody);
      }

      if(d.choices.length > 0){
        let questionChoices = $("<div />").addClass("d-grid gap-2");
        d.choices.forEach(function(j,k){
          $("<button />")
            .addClass("btn btn-light")
            .attr("type","button")
            .attr("data-adventure-goto", j.ifChosenGoTo)
            .text(j.option)
            .on("click", base.activateQuestions)
            .appendTo(questionChoices);
        });
        questionChoices.appendTo(questionBody);
      }
      
      if(d.explanation !== "" && d.audio !== ""){
        explanation.appendTo(questionBody);
      }
      
      questionBody.appendTo(questionHolder);
      questionHolder.appendTo(base.$el);
      if(!first){
        questionHolder.hide();
      }
      
      base.$el.find('audio').mediaelementplayer({
          pluginPath: '/js/mediaelement/'
      });
        
    }
    
    base.activateQuestions = function(){
      
      //show explanation
      $(this).closest(".card").find(".explanation").removeClass("visually-hidden");
      
      //get audio if there is one
      let audio = $(this).closest(".card").find('audio');
      
      if(audio.length){
        audio.get(0).pause();
      }
      
      //disable buttons just clicked
      let scrollTo = $('.active')
        .removeClass('active')
        .find('button')
        .addClass('disabled')
        .offset().top;
      
      //$("html,body").animate({'scrollTop': scrollTo + ($(window).height()*0.1)}, {duration:200, queue:false, delay:0, easing:'easeOutCubic'});
      
      //save number of where we're going
      let goto = $(this).data('adventure-goto');
      
      base.createQuestion(base.findObjectByKey(base.data, "id", goto), false);
      
      
      $('.active').slideDown({queue: false});
      

      
      
      
    }
    
    

    // Sample Function, Uncomment to use
    /**
     * Find Object By Key
     * @param  {Array} [array] Array to search
     * @param  {String} [key] The key of the object
     * @param  {Mixed} [value] Which value to match.
     * @return {Mixed} Either null or value found
     * @api private
     */  
     base.findObjectByKey = function(array, key, value) {
          for (var i = 0; i < array.length; i++) {
              if (array[i][key] === value) {
                  return array[i];
              }
          }
          return null;
      }
     
     
      base.makeQuestionAppear = function(questionNum, currentQuestion){
        
        let questionElement = base.findObjectByKey(base.data, "id", questionNum).elm;
        
        currentQuestion.css('opacity', 0.25)
        questionElement.removeClass('visually-hidden');
        
        base.scrollToQuestion(questionElement);
        
      }
      
      base.scrollToQuestion = function(questionElm){
        let scrollPosition = questionElm.offset().top - ($(window).height()/2)
        $('html,body').stop().animate({'scrollTop': scrollPosition }, {duration:500, queue:false, delay:0});
      }
      
      

    // Run initializer
    base.init();
  };

  $.chooseYourOwnAdventure.defaultOptions = {
    cssStyles: true,
    borderStyle: "1px solid rgba(0,0,0,.125)",
    borderRadius: ".25rem",
    backgroundColor: "none",
    padding: "1rem",
    titleFont: "Georgia, serif",
    titleFontSize: "1.75rem",
    bodyFont: "sans-serif",
    buttonColor: "#cccccc",
    textColor: "#000000"
  };

  $.fn.chooseYourOwnAdventure = function(data, options){
    return this.each(function(){
      const adventure  = (new $.chooseYourOwnAdventure(this, data, options));

      //start with first question
      adventure.createQuestion(adventure.data[0], true);


    });
  };
    
})(jQuery);