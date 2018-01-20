function obtenerDatos(){
	var xhr = Ti.Network.createHTTPClient({
  		onload: function onLoad(){
  			var parseoDatos = JSON.parse(this.responseText);
  			//Ti.API.info(JSON.stringify(parseoDatos));
	    	guardarDatos(parseoDatos);
	  	},
	  	onerror: function onError(){
	    	//alert('Error: \n' + this.status + ': ' + this.responseText);
	    	var dialog = Ti.UI.createAlertDialog({
			    message: 'Existe error en la petición de datos\n¿Volver a intentar?',
			    buttonNames: ['Aceptar', 'Cancelar'],
			    cancel: 1,
			    title: 'Error ' + this.status +': Petición de datos Fallida'
			});
			dialog.addEventListener('click', function(e) {
			    if (e.index == "0") {
			      //alert("Reintentando Proceso");
			      obtenerDatos();
			    }
			});
		   	dialog.show();
	  	}
	});

	xhr.open('GET', 'https://ac7ad0ddc76ca13d5af57c69f96c597f966cca9d.cloudapp-enterprise.appcelerator.com/api/reporteExtravioDeMenor');
	var authstr = 'Basic ' + Ti.Utils.base64encode('1YJPTW2nigEcdhFMcxckE46CdTB0+eDd:');
	xhr.setRequestHeader('Authorization', authstr);
	xhr.send();
}

items = [];
function guardarDatos(alertas){
	objeto = alertas.reporteextraviodemenors;
	for(var i=0;i<objeto.length;i++) {
	    items.push({
	    	id: {text: JSON.stringify(alertas.reporteextraviodemenors[i].id)},
			listNombre:	{text: JSON.stringify(alertas.reporteextraviodemenors[i].nombre_completo).replace(/"/g, '')},
			//avatar: {image: JSON.stringify(alertas.reporteextraviodemenors[i].foto)}
		});
	}
	$.listaAlertas.sections[0].setItems(items);
}
obtenerDatos();

$.listaAlertas.addEventListener("itemclick", function(e){
	var idSeleccion = items[e.itemIndex].id;
	var miID = idSeleccion.text;
	var info = Widget.createController('informacion', {campo: miID}).getView();
	info.open();  
});
