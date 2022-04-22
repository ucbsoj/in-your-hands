/**************************
jQuery Scroll Background Swap by Jeremy Rue https://github.com/jrue

LICENSE: CC BY-NC-SA Attribution-NonCommercial-ShareAlike

You are free to remix, adapt, and build upon this work non-commercially, as long as you credit me and license the new creations under the identical terms. 

https://creativecommons.org/licenses/by-nc-sa/4.0/
**************************/


(function($){
  
  $.videoScroll = function(el, options){

    var base = this;
    
    //merge options passed in during instantiation with our defaults
    base.options = $.extend({},$.videoScroll.defaultOptions, options);
  

    // Access to jQuery and DOM versions of element
    base.$el = $(el);
    base.el = el;
    base.context = base.el.getContext('2d');
    
    //image reference. Everytime we change src property, it changes canvas
    base.img = new Image();
    base.img.onload = ()=> base.context.drawImage(base.img, 0, 0);
    
    //to get the scrolltop info of the container holding the canvas.
    base.container = base.$el.parent().get(0);
  
    //responsive canvas
    base.el.width = base.options.width;
    base.el.height = base.options.height;
    base.$el.css('width', '100%');
    

    base.init = ()=>{
      

      base.frameIndex = 0;
      base.preLoadImages();
      
      let resizeTimer;
      $(window).on('resize', ()=>{
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(base.setCanvasSize, 200);
      });
      base.setCanvasSize();
      
      
      //credit: https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/
      $(window).on('scroll', () => {
        const distanceFromTop = window.scrollY + base.container.getBoundingClientRect().top;
        const rawPercentScrolled = (window.scrollY - distanceFromTop) / (base.container.scrollHeight - window.innerHeight);
        const percentScrolled = Math.min(Math.max(rawPercentScrolled, 0), 1);
        base.frameIndex = Math.max(1,Math.ceil(percentScrolled * base.options.imageCount));
        window.requestAnimationFrame(()=> base.updateImage(base.frameIndex));
      });
      
    };
    
    base.preLoadImages = () => {
      for (let i = 1; i < base.options.imageCount; i++){
        const img = new Image();
        img.src = base.currentFrame(i);
      }
    }
    
    base.currentFrame = index => (
        `${base.options.imageFolder}/${index.toString().padStart(base.options.digits, '0')}.${base.options.imageType}`
    );
    
    base.updateImage = index => {
      base.img.src = base.currentFrame(index);
      base.context.drawImage(base.img, 0, 0);
    }
    
    base.setCanvasSize = () => {
      let heightRatio = base.options.height / base.options.width;
      base.$el.height(base.$el.width() * heightRatio);
    }

    // Run initializer
    base.init();
  };
  
  $.videoScroll.defaultOptions = {
      width: 960,
      height: 540,
      imageFolder: 'images',
      imageType: 'jpg',
      imageCount: 60,
      digits: 3
  };


  $.fn.videoScroll = function(options){
    
    return this.each(function(){
      
      const videoScroll  = (new $.videoScroll(this, options));

    });
  };
    
})(jQuery);