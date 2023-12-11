/*global define*/
/*eslint no-undef: "error"*/

define([], function () {
	let CustomWidget = function () {
		let self = this;
		this.callbacks = {
			render: function () {
				console.log("render");
				return true;
			},
			init: function () {
				const settings = self.get_settings();
				console.log(settings);
				console.log("init");
				return true;
			},
			bind_actions: function () {
				console.log("bind_actions");
				return true;
			},
			settings: function () {
				console.log("settings");
				return true;
			},
			onSave: function () {
				console.log("click");
				return true;
			},
			destroy: function () {

			},
			dpSettings: function () {

			},

		};
		return this;
	};
	return CustomWidget;
});
