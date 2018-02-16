function ProgressBar(el){
  this.el = el;
  this.delay = el.getAttribute("data-delay") ? parseInt(el.getAttribute("data-delay")) : 0;
  this.value = el.getAttribute("data-value") ? parseInt(el.getAttribute("data-value")) : 0;
  this.init();
  this.show();
}

ProgressBar.prototype = {
  
  get computeValue() {
    return this.value - 100;
  },
  
  show: function(){
    var self = this;
    setTimeout(function(){
      self.bar.setAttribute("style", "width: "+self.value+"%;")
      self.bar.setAttribute("data-value", self.value+"%")
    }, this.delay + 300)
    console.log(this.delay);
  },

  init: function(){
   // Create bar if isn't exist
    this.bar = this.el.querySelector(".progress__bar");
    if( !this.bar ){
      this.bar = document.createElement("span");
      this.bar.className = "progress__bar";
      this.el.appendChild(this.bar);
    }
  }

}

export default ProgressBar;
