(function( $ ) {
  $.widget( "sasi.foldable", {
 
	 options: { 
    	openAngle : 0
    },
 
    _create: function() {
    	if(!this.options.direction)  this.options.direction = 'x';
    	this.element.css('background-color', "#fff");
    	if(this.options.openAngle === 90) {
    		this.element.hide();
    	}
    },
 
    _setOption: function( key, value ) {
      switch( key ) {
        case "clear":
          break;
      }
      $.Widget.prototype._setOption.apply( this, arguments );
      this._super( "_setOption", key, value );
    },
    
    _fold: function(direction) {   	
    	if( console && this.options.openAngle == 45 ) {
    		console.log("45 degree, start debugging ....");
    	}
    	
    	if( direction === -1 && this.options.openAngle <= 0) {
    		this.options.openAngle = 0;
    		this.options.invisible1.hide();
    		this.options.invisible2.hide();
    		this.options.viewPort.hide();
    		this.element.show();
    		this.options.inprogress = false;
    		this.options.viewPort.remove();
    		this._trigger('opened');
    		return;
    	}
    	
    	if( direction === 1 && this.options.openAngle >= 90) {
    		this.options.openAngle = 90;
    		this.options.inprogress = false;
    		this.options.viewPort.remove();
    		this._trigger('closed')
    		return;
    	}
    	
    	if( direction === 1 && this.options.openAngle === 0) {
    		this.options.invisible1.show();
    		this.options.invisible2.show();
    		this.options.viewPort.show();
    		this.element.hide();
    	}
    	
    	var rotateDir = 'rotateX' ;
    	if( this.options.direction === 'y') {
    		rotateDir = 'rotateY' ;
    	}
    	
    	this.options.openAngle = this.options.openAngle + ( 2 * direction);
    	
    	var angleToRotate = this.options.openAngle;
    	if( this.options.direction === 'y') {
    		angleToRotate = -angleToRotate;
    	}
    	
    	var spin = rotateDir + "(" + -angleToRotate + "deg)";
    	this.options.invisible1.css("-webkit-transform", spin);
    	this.options.invisible1.css("-moz-transform", spin);
    	this.options.invisible1.css("-ms-transform", spin);
    	this.options.invisible1.css("transform", spin);
    	
    	spin = rotateDir + "(" + angleToRotate + "deg)";
    	this.options.invisible2.css("-webkit-transform", spin);
    	this.options.invisible2.css("-ms-transform", spin);
    	this.options.invisible2.css("-moz-transform", spin);
    	this.options.invisible2.css("transform", spin);
    	
    	if( this.options.direction === 'x') {
    		this.options.lengthOpen = this.options.halfHeight * Math.cos( this.options.openAngle * Math.PI/180 ); 
    	} else {
    		this.options.lengthOpen = this.options.halfWidth * Math.cos( this.options.openAngle * Math.PI/180 );
    	}
    	
    	if(this.options.openAngle == 90) {
    		this.options.lengthOpen = 0;
    	}
    	
    	if( this.options.direction === 'x') {
	    	this.options.viewPort.height(this.options.lengthOpen * 2);
    	} else {
	    	this.options.viewPort.width(this.options.lengthOpen * 2);
    	}
    	    	
    	this._adjustLight();
    	
    	var that = this;
    	
    	
    	if(this.options.openAngle >= 0 && this.options.openAngle <= 90) {
    		setTimeout(function(){
    			that._fold(direction);
    			}
    		,10);
    	} else {
    		this.options.inprogress = false;
    		this.options.viewPort.remove();
    	}
    },
    
    _adjustLight: function() {
    	var darknessUpper = (( this.options.lengthOpen / this.options.halfHeight ) * 100)/2;
    	var darknessLower = (( this.options.lengthOpen / this.options.halfHeight ) * 100);
    	
    	var shadeUpper = Math.floor(255 - (50 - darknessUpper )) ; 
    	var shadeLower = Math.floor(255 - (100 - darknessLower )) ;
	
    	if( this.options.direction === 'x') {
			this.options.contentClone1.css('background', '-webkit-gradient(linear,left top,left bottom,from(rgb('+ shadeUpper + ', ' + shadeUpper + ', ' + shadeUpper + ')),to(#FFFFFF))');
			this.options.contentClone2.css('background', '-webkit-gradient(linear,left center,left bottom,from(rgb('+ shadeLower + ', ' + shadeLower + ', ' + shadeLower + ')),to(#FFFFFF))');
			this.options.contentClone1.css('background', 'linear-gradient(to top, rgb('+ shadeUpper + ', ' + shadeUpper + ', ' + shadeUpper + '), #FFFFFF)');
			this.options.contentClone2.css('background', 'linear-gradient(to bottom,  rgb('+ shadeLower + ', ' + shadeLower + ', ' + shadeLower + '), #FFFFFF )');
    	} else {
			this.options.contentClone1.css('background', '-webkit-gradient(linear,center top, left top,from(rgb('+ shadeUpper + ', ' + shadeUpper + ', ' + shadeUpper + ')),to(#FFFFFF))');
			this.options.contentClone2.css('background', '-webkit-gradient(linear, center top, right top, from(rgb('+ shadeLower + ', ' + shadeLower + ', ' + shadeLower + ')),to(#FFFFFF))');
			this.options.contentClone1.css('background', '-webkit-gradient(to left, rgb('+ shadeUpper + ', ' + shadeUpper + ', ' + shadeUpper + '), #FFFFFF)');
			this.options.contentClone2.css('background', '-webkit-gradient(to right,  rgb('+ shadeLower + ', ' + shadeLower + ', ' + shadeLower + '), #FFFFFF)');			
    	}
    },
 
    destroy: function() {
      $.Widget.prototype.destroy.call( this );
    },
    
    _prepareToFold: function() {
    	this.options.contentHeight = this.element.height();
    	this.options.halfHeight = Math.floor(this.options.contentHeight / 2);
    	this.options.contentWidth = this.element.width();
    	this.options.halfWidth = Math.floor(this.element.width() / 2);
    	
    	this.options.viewPort = $('<div class="viewPort"></div>').insertAfter(this.element);
    	
    	if( this.options.direction === 'x') {
    		this._createFakePanelsX();
    	} else {
    		this._createFakePanelsY();
    	}
    },
    
    _createFakePanelsX: function () {
    	var htmlConetent = this.element.clone();
    	this.options.contentClone = htmlConetent;
    	htmlConetent.show();
    	this.options.invisible2 = $('<div class="lowerFold"><div class="contentHolderBottom"></div></div>');
    	this.options.contentHolder2 = this.options.invisible2.find('.contentHolderBottom');
    	this.options.invisible2.width(this.options.contentWidth);
    	this.options.contentHolder2.width(this.options.contentWidth);
    	this.options.contentClone2 = htmlConetent.clone();
    	this.options.contentHolder2.append(this.options.contentClone2);

	
    	this.options.invisible1 = $('<div class="upperFold"><div class="contentHolderTop"></div></div>');
    	this.options.contentHolder1 = this.options.invisible1.find('.contentHolderTop');
    	this.options.contentHolder1.width(this.options.contentWidth);
    	this.options.invisible1.width(this.options.contentWidth);
    	this.options.contentClone1 = htmlConetent.clone();
    	this.options.contentHolder1.append(this.options.contentClone1);

    	
    	this.options.invisible2.height(this.options.halfHeight);
    	this.options.invisible1.height(this.options.halfHeight);
    	
    	this.options.viewPort.append(this.options.invisible1);
    	this.options.viewPort.append(this.options.invisible2);
    	
    	this.options.viewPort.height(0);
    },
    
    _createFakePanelsY: function () {
    	var htmlConetent = this.element.clone();
    	
    	this.options.invisible2 = $('<div class="rightFold"><div class="contentHolderRight"></div></div>');
    	this.options.contentHolder2 = this.options.invisible2.find('.contentHolderRight');
    	this.options.contentHolder2.height(this.options.contentHeight);
    	this.options.contentHolder2.width(this.options.contentWidth);
    	this.options.contentClone2 = htmlConetent.clone();
    	this.options.contentHolder2.append(this.options.contentClone2);
	
    	this.options.invisible1 = $('<div class="leftFold"><div class="contentHolderLeft"></div></div>');
    	this.options.contentHolder1 = this.options.invisible1.find('.contentHolderLeft');
    	this.options.contentHolder1.height(this.options.contentHeight);
    	this.options.contentHolder1.width(this.options.contentWidth);
    	this.options.contentClone1 = htmlConetent.clone();
    	this.options.contentHolder1.append(this.options.contentClone1);
    	
    	this.options.invisible2.width(this.options.halfWidth);
    	this.options.invisible1.width(this.options.halfWidth);
    	this.options.invisible2.height(this.options.contentHeight);
    	this.options.invisible1.height(this.options.contentHeight);
    	
    	this.options.viewPort.append(this.options.invisible1);
    	this.options.viewPort.append(this.options.invisible2);
    	
    	this.options.viewPort.width(0);
    	this.options.viewPort.height(this.options.contentHeight)
    },
    open: function () {
    	if(this.options.inprogress) {
    		return false;
    	}
    	this._prepareToFold();
    	this.element.hide();
		this.options.inprogress = true;
		this._fold( -1 );   
    },

    close: function () {
    	if( this.options.inprogress) {
    		return false;
    	}
		this._prepareToFold();
		this.options.inprogress = true;
		this._fold( 1 );
    }
    
  });
}( jQuery ) );