
export default class Project {
	constructor(el, ctx) {
		this.el = el;


		this.container = this.el.querySelectorBEM(".project", "project");
		this.close = this.el.querySelector(".project__close");

		this.ctx = ctx;

	}
}