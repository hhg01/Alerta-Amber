var Arrow = require('arrow');
var Model = Arrow.createModel('reporteExtravioDeMenor', {
    fields: {
        foto: {
            type: Object
        },
        nombre_completo: {
            type: String,
            required: true
        },
        fecha_nacimiento: {
            type: String,
            required: true
        },
        fecha_hechos: {
            type: String,
            required: true
        },
        genero: {
            type: String,
            required: true
        },
        nacionalidad: {
            type: String
        },
        cabello: {
            type: String
        },
        color_cabello: {
            type: String
        },
        color_ojos: {
            type: String
        },
        estatura: {
            type: Number
        },
        peso: {
            type: Number
        },
        señas: {
            type: String,
            required: true
        },
        direccion: {
            type: String
        },
        descripcion: {
            type: String
        },
        nombre_parentesco: {
            type: String,
            required: true
        },
        telefono: {
            type: Number,
            required: true
        }
    },
    connector: 'appc.arrowdb',

});
module.exports = Model;
