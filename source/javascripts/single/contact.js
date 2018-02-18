
export default {

	init: function(ctx){
		this.ctx = ctx;
		this.ctx.bg.clipCanvas.displayArrow("top");

		var self = this;
		var form = document.getElementById("sendmail");
		this.submit = form.querySelectorBEM(".form__submit-container", "form");

		form.addEventListener("submit", function(ev){
			var fd = new FormData(this);
			var oReq = new XMLHttpRequest();
			oReq.open("POST", "/postmail.php", true);
			
			oReq.onload = function(oEvent) {
				var responseTxt = oReq.responseText; 
				if (oReq.status == 200) {
					var response = JSON.parse(responseTxt);
					self.manageFormResponse(response);
				} else {
					responseTxt = null;
					var response = JSON.parse(responseTxt);
					if( !response ){
						response = { success: false }	
					}
					self.manageFormResponse(response);
				}
			};
			self.formState = "loading";
			oReq.send(fd);
  			ev.preventDefault();
		})
	},

	set formState(state){
		
		
		if( state == "loading"){
			this.submit.removeAllMod();
			this.submit.addMod("loading")
		} else if(state === "success") {
			setTimeout(() => {
				this.submit.removeAllMod();
				this.submit.addMod("success");
			}, 1000); 
		}
	},

	manageFormResponse: function(response){
		if( response.success ){
			// alert("Mail send with success")
			this.formState = "success";
		} else {
			alert("An error occured")
		}
	}
}