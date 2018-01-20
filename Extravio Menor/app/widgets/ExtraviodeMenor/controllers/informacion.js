// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
function obtenerDatos(){
	var xhr = Ti.Network.createHTTPClient({
  		onload: function onLoad(){
  			var parseoDatos = JSON.parse(this.responseText);
  			//Ti.API.info(JSON.stringify(parseoDatos));
	    	guardarDatos(parseoDatos);
	  	},
	  	onerror: function onError(){
	    	alert('Error: \n' + this.status + ': ' + this.responseText);
	  	}
	});

	xhr.open('GET', 'https://ac7ad0ddc76ca13d5af57c69f96c597f966cca9d.cloudapp-enterprise.appcelerator.com/api/reporteExtravioDeMenor');
	var authstr = 'Basic ' + Ti.Utils.base64encode('1YJPTW2nigEcdhFMcxckE46CdTB0+eDd:');
	xhr.setRequestHeader('Authorization', authstr);
	xhr.send();
}

function guardarDatos(alertas){
	var objeto = alertas.reporteextraviodemenors;
	for(var i=0;i<objeto.length;i++) {
	    if (args.campo == JSON.stringify(alertas.reporteextraviodemenors[i].id)){
	    	
	    	//$.imageFoto.image = Ti.Utils.base64decode(JSON.stringify(alertas.reporteextraviodemenors[i].foto));
	    	//var stringImage = JSON.stringify(alertas.reporteextraviodemenors[i].foto);
	    	//alert(stringImage.replace(/"/g, ''));
	    	//alert(Ti.Utils.base64decode(JSON.stringify(alertas.reporteextraviodemenors[i].foto)));
	    	
	    	$.lblNombre.setText(JSON.stringify(alertas.reporteextraviodemenors[i].nombre_completo).replace(/"/g, ''));
	    	$.lblFechaNacimValor.setText(JSON.stringify(alertas.reporteextraviodemenors[i].fecha_nacimiento).replace(/"/g, ''));
	    	$.lblGeneroValor.setText(JSON.stringify(alertas.reporteextraviodemenors[i].genero).replace(/"/g, ''));
			$.lblFechaHechValor.setText(JSON.stringify(alertas.reporteextraviodemenors[i].fecha_hechos).replace(/"/g, ''));
			$.lblDescFisicaValor.setText("Cabello "+JSON.stringify(alertas.reporteextraviodemenors[i].cabello).replace(/"/g, '')+" de color "+JSON.stringify(alertas.reporteextraviodemenors[i].color_cabello).replace(/"/g, '')+" color de ojos "+JSON.stringify(alertas.reporteextraviodemenors[i].color_ojos).replace(/"/g, '')+" estatura aprox. "+JSON.stringify(alertas.reporteextraviodemenors[i].estatura)+"cm peso aprox. "+JSON.stringify(alertas.reporteextraviodemenors[i].peso)+"kg de nacionalidad "+JSON.stringify(alertas.reporteextraviodemenors[i].nacionalidad).replace(/"/g, ''));
			$.lblSeñasValor.setText(JSON.stringify(alertas.reporteextraviodemenors[i].señas).replace(/"/g, ''));
			$.lblLugarHechosValor.setText(JSON.stringify(alertas.reporteextraviodemenors[i].direccion).replace(/"/g, ''));
			$.lblDescHechosValor.setText(JSON.stringify(alertas.reporteextraviodemenors[i].descripcion).replace(/"/g, ''));
			$.lblParentesco.setText(JSON.stringify(alertas.reporteextraviodemenors[i].nombre_parentesco).replace(/"/g, ''));
			$.lblTelefono.setText(JSON.stringify("telefono: "+alertas.reporteextraviodemenors[i].telefono).replace(/"/g, ''));
	    }
	}
}
obtenerDatos();

function enviarMensaje(e){
    var winAportacion = Widget.createController('aportacion').getView();
    winAportacion.open();
};
