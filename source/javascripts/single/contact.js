
export default {

	init: function(ctx){
		this.ctx = ctx;
		this.ctx.bg.clipCanvas.displayArrow("top");

		var form = document.getElementById("sendmail");
		form.addEventListener("submit", function(ev){
			var fd = new FormData(this);
			var oReq = new XMLHttpRequest();
			oReq.open("POST", "/postmail.php", true);
			
			oReq.onload = function(oEvent) {
				if (oReq.status == 200) {
					console.log(oEvent)
				} else {
					console.log(oEvent)
				}
			};
			oReq.send(fd);
  			ev.preventDefault();
		})
	}
}