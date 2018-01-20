// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
/*++++++++++++++++++++++++++++++++abre la ventana lista de alertas+++++++++++++++++++++++++++++++++++++++++*/
function listaAlertas(){
	var lista = Widget.createController('listaAlertas').getView();
	lista.open();
}
/*++++++++++++++++++++++++++++++++boton de camara+++++++++++++++++++++++++++++++++++++++++*/
$.camposFotoBotonesCamara.addEventListener('click', function(_e) {
    Titanium.Media.showCamera({
        success : function(event) {
            image = event.media;
            $.camposFotoFoto.image = image;
        },
        error : function(error) {
            var a = Ti.UI.createAlertDialog({
                title : "Error en Camara"
            });
            if (error.code == Ti.Media.NO_CAMERA) {
                a.setMessage("MISSING CAMERA");
            } else {
                a.setMessage('Error Inesperado: ' + error.code);
            }
            a.show();
        },
        saveToPhotoGallery : false,
        allowEditing : false,
        mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
    });

});
/*++++++++++++++++++++++++++++++++boton de galeria+++++++++++++++++++++++++++++++++++++++++*/
$.camposFotoBotonesArchivos.addEventListener("click", function(e){
    Titanium.Media.openPhotoGallery({
        success:function(e){
           image = e.media;
           $.camposFotoFoto.image = image;
        },
        error:function(e){
            alert("Aparecio un error");
        }
    });
});
/*++++++++++++++++++++++++++++++++picker del label en fecha nacimiento+++++++++++++++++++++++++++++++++++++++++*/
$.labelFechaNacimiento.addEventListener('click', function(e){
	var pickerNacimiento = Ti.UI.createPicker({
	  type:Ti.UI.PICKER_TYPE_DATE,
	  minDate:new Date(2000,0,1),
	  maxDate:new Date()
	});
	var dialog = Ti.UI.createAlertDialog({
	    title: 'Fecha de Nacimiento',
	    androidView: pickerNacimiento,
	    ok: 0,
	    cancel: 1,
	    buttonNames: ['Confirmar','Cancelar']
	});
	dialog.addEventListener('click', function(e) {
		if (e.index === e.source.ok){
			var fecha_nacimiento_text = new Date(e.source.androidView.value);
			var diaNacimiento = fecha_nacimiento_text.getDate();
			var mesNacimiento = fecha_nacimiento_text.getMonth()+1;
			diaNacimiento = checkTime(diaNacimiento);
			mesNacimiento = checkTime(mesNacimiento);
	    	$.labelFechaNacimiento.setText(diaNacimiento+"/"+mesNacimiento+"/"+fecha_nacimiento_text.getFullYear());
	    }
	});
	dialog.show();
});
function checkTime(i){
    if (i < 10) {
    	i = "0"+i;
    };
    return i;
}
/*++++++++++++++++++++++++++++++++picker del label en fecha hechos+++++++++++++++++++++++++++++++++++++++++*/
$.labelFechaHechos.addEventListener('click', function(){
	var picker = Ti.UI.createPicker({
	  type:Ti.UI.PICKER_TYPE_DATE,
	  minDate:new Date(2000,1,1),
	  maxDate:new Date()
	});
	var alertDialog = Ti.UI.createAlertDialog({
	    title: 'Fecha de los Hechos',
	    androidView: picker,
	    ok: 0,
	    cancel: 1,
	    buttonNames: ['Confirmar', 'Cancelar']
	});
	alertDialog.addEventListener('click', function(e) {
		if (e.index === e.source.ok){
			var fecha_hechos_text = new Date(e.source.androidView.value);
			var diaHechos = fecha_hechos_text.getDate();
			var mesHechos = fecha_hechos_text.getMonth()+1;
			diaHechos = checkTime(diaHechos);
			mesHechos = checkTime(mesHechos);
	    	$.labelFechaHechos.setText(diaHechos+"/"+mesHechos+"/"+fecha_hechos_text.getFullYear());
	    }
	});
	alertDialog.show();	
});
/*++++++++++++++++++++++++++++++++obtencion de latitud y longitod(dirección)+++++++++++++++++++++++++++++++++++++++++*/
Titanium.Geolocation.getCurrentPosition(function(position) {
    if (!position.success || position.error) {
        alert('No se pudo encontrar la ubicación del dispositivo');
        return;
    }
    longitud = position.coords.longitude;
    latitud = position.coords.latitude;

    Titanium.Geolocation.reverseGeocoder(latitud, longitud, function(result) {
       if (!result.success || !result.places || result.places.length == 0) {
           alert('No pude encontrar ningún lugar.');
           return;
       }
       miUbicacion = JSON.stringify(result.places[0].address);
    });
});
/*++++++++++++++++++++++++++++++++mapa con pin del label+++++++++++++++++++++++++++++++++++++++++*/
var MapModule = require('ti.map');
var random = Alloy.Globals.Map.createAnnotation({
    latitude: latitud,
    longitude: longitud,
    pincolor: MapModule.ANNOTATION_RED,
    draggable: true
});
$.mapa.region = {
	latitude : latitud,
	longitude : longitud,
	latitudeDelta : 0.001,
	longitudeDelta : 0.01,
};
$.mapa.addAnnotation(random);
/*++++++++++++++++++++++++++++++++boton de envio de datos(POST)+++++++++++++++++++++++++++++++++++++++++*/
$.botonEnvio.addEventListener('click', function(){
	if($.textNombre.getValue() !== "" && $.textApellido.getValue() !== "" && $.labelFechaNacimiento.getText() !== "DD/MM/AAAA"
	&& $.labelFechaHechos.getText() !== "DD/MM/AAAA" && $.pickerGenero.getSelectedRow(0).title !== "--"
	&& $.textSeñas.getValue() !== "" && $.textParentesco.getValue() !== "" && $.textNombreP.getValue()!== ""
	&& $.textTelefono.getValue() !== ""){
		
		//imagenParse = image;
		//Ti.API.info($.camposFotoFoto.toBlob());
		//var otro = $.camposFotoFoto.toBlob();
		//Ti.API.info(JSON.stringify(imagenParse));
		//Ti.API.info("========================================");
		//Ti.API.info(JSON.stringify(imagenParse.nativePath));
		//Ti.API.info("========================================");
		//Ti.API.info(JSON.stringify(imagenParse.file));
		//alert($.camposFotoFoto.getImage());
		//Ti.API.info(JSON.stringify(otro));
		var xhr = Ti.Network.createHTTPClient({
		  	onload: function onLoad() {
		  		//Ti.API.info(JSON.stringify(this));
			    //alert('Loaded: ' + this.status + ': ' + this.responseText);
			    var dialog = Ti.UI.createAlertDialog({
				    message: 'Tu Alerta ha sido Enviada con Exito a la Policia y a los Usuarios de SmartCDMX',
				    ok: 'Aceptar',
				    title: 'Datos Enviados'
				});
			   	dialog.show();
			    //enviarPushNotification();
			},
			onerror: function onError() {
				if(this.status == 404){
					var dialog = Ti.UI.createAlertDialog({
					    message: 'Error al guardar los datos, verificalos porfavor',
					    ok: 'Aceptar',
					    title: 'Datos Invalidos'
					});
				   	dialog.show();
				}
				if(this.status == 500){
					var dialog = Ti.UI.createAlertDialog({
					    message: 'Fue Notificada la Policia y se esta procesando para avisar a los Usuarios de SmartCDMX',
					    ok: 'Aceptar',
					    title: 'Procesando Datos'
					});
				   	dialog.show();
				}
				if(this.status == 504){
					var dialog = Ti.UI.createAlertDialog({
					    message: 'Fue Notificada la Policia y tu alerta esta guardada en SmartCDMX para que sus Usuarios la puedan ver',
					    ok: 'Aceptar',
					    title: 'Datos Procesados'
					});
				   	dialog.show();
				}
				//alert('Error: ' + this.responseText);
				Ti.API.info('Error: ' + this.responseText);
			}
		});
		var parametros = {
	        //foto: Ti.Utils.base64encode($.camposFotoFoto.getImage()),
	        nombre_completo: $.textNombre.getValue()+" "+$.textApellido.getValue(),
	        fecha_nacimiento: $.labelFechaNacimiento.getText(),
	        fecha_hechos: $.labelFechaHechos.getText(),
	        genero: $.pickerGenero.getSelectedRow(0).title,
	        nacionalidad: $.pickerNacion.getSelectedRow(0).title,
	        cabello: $.pickerCabello.getSelectedRow(0).title,
	        color_cabello: $.pickerColorCabello.getSelectedRow(0).title,
	        color_ojos: $.pickerOjos.getSelectedRow(0).title,
	        estatura: $.textEstatura.getValue(),
	        peso: $.textPeso.getValue(),
	        señas: $.textSeñas.getValue(),
	        direccion: miUbicacion,
	        descripcion: $.textDescripcion.getValue(),
	        nombre_parentesco: $.textParentesco.getValue()+": "+$.textNombreP.getValue(),
	        telefono: $.textTelefono.getValue()
	    };
		xhr.open('POST', 'https://ac7ad0ddc76ca13d5af57c69f96c597f966cca9d.cloudapp-enterprise.appcelerator.com/api/reporteExtravioDeMenor');
		var authstr = 'Basic ' + Ti.Utils.base64encode('1YJPTW2nigEcdhFMcxckE46CdTB0+eDd:');
		xhr.setRequestHeader('Authorization', authstr);
		xhr.send(parametros);
		 
	}else{
		if($.textNombre.getValue() !== "" || $.textApellido.getValue() !== "" || $.labelFechaNacimiento.getText() !== "DD/MM/AAAA"
		|| $.labelFechaHechos.getText() !== "DD/MM/AAAA" || $.pickerGenero.getSelectedRow(0).title !== "--"
		|| $.textSeñas.getValue() !== "" || $.textParentesco.getValue() !== "" || $.textNombreP.getValue()!== ""
		|| $.textTelefono.getValue() !== ""){
			var dialog = Ti.UI.createAlertDialog({
			    message: 'Falta llenar algún campo Obligatorio',
			    ok: 'Aceptar',
			    title: 'Datos Invalidos'
			});
		   	dialog.show();
		}else{
			var dialog = Ti.UI.createAlertDialog({
			    message: 'Llena todos los campos Obligatorios',
			    ok: 'Aceptar',
			    title: 'Datos Invalidos'
			});
		   	dialog.show();
		}
	}
});

/*+++++++++++++++++++++ENVIAR PUSH NOTIFICATIONS+++++++++++++++++++++++++*/
/* VARIABLES GLOBALES */
/*var latitud;
var longitud;
var deviceToken = null;
var CloudPush = require('ti.cloudpush');// Requerir el modulo cloudpush
var Cloud = require("ti.cloud");// Requerir el modulo cloud

//////////////////////////////////////////OBTENER TOKEN DEL DISPOSITIVO////////////////////////////////////////
function obtenerToken(){
	/*Recupera de forma asíncrona el token del dispositivo específico de la aplicación.
  	Este token se usa en las llamadas a los servicios en la nube de Appcelerator para suscribirse o anular la suscripción a los canales de notificación push.
  	Este token es único para cada aplicacion y dispositivo */
	/*CloudPush.retrieveDeviceToken({
    	success: deviceTokenSuccess,
    	error: deviceTokenError
	});
	/*Habilita push notifications para este dispositivo 
  	Guarda el token para posteriores llamadas a la API (cloud appcelerator api)*/
	/*function deviceTokenSuccess(e) {
    	deviceToken = e.deviceToken;
    	console.log("exito al obtener el token del dispositivo");
    	loginUser(); //invoca esta funcion para iniciar sesion
    	//console.log(typeof(deviceToken)); //test dev
    	//console.log("el token device es:"); //test dev
    	//Ti.API.info(deviceToken); //test dev
	}
	/*en caso de error */
	/*function deviceTokenError(e) {
	    alert('Fracaso al registrarse para push notifications! ' + e.error);
	}

	/*Callback event handlers
	  Procesa las push notifications entrantes */
	/*CloudPush.addEventListener('callback', function (evt) {
		//aqui va abrir la boleta informativa ejemplo: $.boleta.open();
	    alert("Notificacion recibida: " + evt.payload);
	});
}

//////////////////////////////////////////INICIAR SESIÓN///////////////////////////////
function loginUser(){
    //Iniciar sesion en Arrow con las credenciales:usuario(se creo en el dashboard con permisos de admin) y contraseña
    Cloud.Users.login({																																																																																																																																																		
        login: 'admin_appc_cgma',
        password: 'zorbagmail224'																													
    }, function (e) {
        if (e.success) {
            console.log('Inicio de sesion exitoso!');
            subscribeToChannel(); //ahora suscribirse
        } else {				
            alert('Error al iniciar sesión:\n' +
                ((e.error && e.message) || JSON.stringify(e)));
        }
    });
}

//////////////////////////////////////SUSCRIBIRSE A UN CANAL(Channel)/////////////////////////////
function subscribeToChannel() {
    // suscribe el dispositivo al canal 'ChannelMenorExtraviado', requiere inicio de sesion.
    //console.log("tipo de variable: "); //test
    //console.log(typeof(deviceToken)); //test
    //console.log("el token device es:"); //test
    //Ti.API.info(deviceToken); //test
    Cloud.PushNotifications.subscribeToken({
        device_token: deviceToken,
        channel: 'channelMenorExtraviado',
        type: 'android' // especifica el tipo de push para el SO 'android'
    }, function (e) {
        if (e.success) {
	            console.log('suscrito al canal exitosamente');
	            obtenerUbicacion(); //ahora obtener ubicacion
        } else {
            alert('Error al suscribirse:\n' + ((e.error && e.message) || JSON.stringify(e)));
        }
    });
}

/////////////////////////////////DARSE DE BAJA DE UN CANAL(Channel)///////////////////////////////
function unsubscribeToChannel() {
    // da de baja el dispositivo del canal 'channelMenorExtraviado'
    Cloud.PushNotifications.unsubscribeToken({
        device_token: deviceToken,
        channel: 'channelMenorExtraviado',
    }, function (e) {
        if (e.success) {
            alert('Dado de baja');
        } else {
            alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
        }
    });
}

////////////////////////////////////////OBTENER UBICACION///////////////////////////////////////////////
function obtenerUbicacion(){
	//checa si tiene permisos de ubicacion
	if (Ti.Geolocation.hasLocationPermissions()) {
		//obtener la posicion actual
		Titanium.Geolocation.getCurrentPosition(function(e) {
    		if (e.error) {
        		Ti.API.error('Error: ' + e.error);
    		} else {
        		latitud = e.coords.latitude; //number
        		longitud = e.coords.longitude; //number
				//////////////update subscription with location:
				//*User Login Required: Yes
				Cloud.PushNotifications.updateSubscription({
    				device_token : deviceToken,
    				su_id: '5a31f9599b391f90a0a66de8',
    				loc : [longitud, latitud]
    			}, function(e) {
    				if (e.success) {
    					console.log('Suscription Actualizada');
    				} else {
    					alert(e);
    				}	
    			});
      		}
		});
	}
	else {
		//si no tiene permisos de ubicacion:
		//parameter Ti.Geolocation.AUTHORIZATION_ALWAYS only for IOS in Android is omitted
		Ti.Geolocation.requestLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS, function(e) {
    		if (e.success === true) {
                alert("Acceso permitido");
                //getCurrentPosition() or registering to listen for location events
        		//Titanium.Geolocation.addEventListener("location", obtenerLocalizacion);
        		obtenerLocalizacion();
          	} else {
				console.log("Acceso denegado, error: " + e.error);
				obtenerLocalizacion();
          	}
      	});
	}
}

//onCreate android ya que solo se debe suscribir una vez
Ti.Android.currentActivity.onCreate = function() {
	obtenerToken();
};

///////////////////////////////////////////////////ENVIAR PUSH NOTIFICATIONS//////////////////////////////
//Send a push notification to a channel
function enviarPushNotification() {
	//User Login Required: Yes
	/* parametro:
	-canal: canal al que se enviara la push
	-where: condicional= a usuarios en un radio de 5 km
	-payload: estructura de la push notification*/
	/*Cloud.PushNotifications.notify({
    	channel: 'channelMenorExtraviado',
    	//to_ids: "everyone", //test
    	//coordinates: list the longitude first and then latitude:
    	/* quety con dos condiciones where: (esta localizacion, este dispositivo no enviar push)
    	where: { $and: [
    		{"loc": { "$nearSphere" : { "$geometry" : { "type" : "Point" , "coordinates" : [longitud,latitud] } , "$maxDistance" : 5000, "$minDistance" : 0}}},
    	    {device_token: {$ne: deviceToken}} ] },
    	*/
    	/*where: {"loc": { "$nearSphere" : { "$geometry" : { "type" : "Point" , "coordinates" : [longitud,latitud] } , "$maxDistance" : 5000, "$minDistance" : 0}}},
    	payload: {
  					"alert": "Un niño se ha extraviado cerca de tu localización ayudanos a encontrarlo.",
  					"icon": "",
  					"sound": "default",
  					"vibrate": true,
  					"title": "SmartCDMX",
  					"priority": "normal"
				}
	}, function (e) {
    	if (e.success) {
        	console.log('Success al enviar push');
    	} else {
        	alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
    	}
	});
}*/