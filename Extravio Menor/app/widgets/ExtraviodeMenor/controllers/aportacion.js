// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function enviarAportacion(e){
	//alertDialog("Tu aportación fue enviada con exito.");
	$.windowAportacion.close();
	$.destroy();
	$.alertDialog.show();
}