/* VARIABLES GLOBALES */
var latitud;
var longitud;
var deviceToken = null;
var CloudPush = require('ti.cloudpush');// Requerir el modulo cloudpush
var Cloud = require("ti.cloud");// Requerir el modulo cloud

//////////////////////////////////////////OBTENER TOKEN DEL DISPOSITIVO////////////////////////////////////////
function obtenerToken(){
	/*Recupera de forma asíncrona el token del dispositivo específico de la aplicación.
  	Este token se usa en las llamadas a los servicios en la nube de Appcelerator para suscribirse o anular la suscripción a los canales de notificación push.
  	Este token es único para cada aplicacion y dispositivo */
	CloudPush.retrieveDeviceToken({
    	success: deviceTokenSuccess,
    	error: deviceTokenError
	});
	/*Habilita push notifications para este dispositivo 
  	Guarda el token para posteriores llamadas a la API (cloud appcelerator api)*/
	function deviceTokenSuccess(e) {
    	deviceToken = e.deviceToken;
    	console.log("exito al obtener el token del dispositivo");
    	loginUser(); //invoca esta funcion para iniciar sesion
    	//console.log(typeof(deviceToken)); //test dev
    	//console.log("el token device es:"); //test dev
    	//Ti.API.info(deviceToken); //test dev
	}
	/*en caso de error */
	function deviceTokenError(e) {
	    alert('Fracaso al registrarse para push notifications! ' + e.error);
	}

	/*Callback event handlers
	  Procesa las push notifications entrantes */
	CloudPush.addEventListener('callback', function (evt) {
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
	Cloud.PushNotifications.notify({
    	channel: 'channelMenorExtraviado',
    	//to_ids: "everyone", //test
    	//coordinates: list the longitude first and then latitude:
    	/* quety con dos condiciones where: (esta localizacion, este dispositivo no enviar push)
    	where: { $and: [
    		{"loc": { "$nearSphere" : { "$geometry" : { "type" : "Point" , "coordinates" : [longitud,latitud] } , "$maxDistance" : 5000, "$minDistance" : 0}}},
    	    {device_token: {$ne: deviceToken}} ] },
    	*/
    	where: {"loc": { "$nearSphere" : { "$geometry" : { "type" : "Point" , "coordinates" : [longitud,latitud] } , "$maxDistance" : 5000, "$minDistance" : 0}}},
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
}

$.win.open();
