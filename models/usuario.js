const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const {Schema} = mongoose;

const usuarioSchema = new Schema({
    nombre: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    apellido: {type: String, required: true},
    rol: {
        type: [String],
        enum: ['profesor', 'alumno', 'administrador'],
        required: true
    },
    
});

// asignar un rol por defecto(esto hay q verlo mejor)
const roleIds = {
    profesor: 1,
    alumno: 2,
    administrador: 0
};

//metodo para obtener el id del rol(con esto que tambien hay qye verlo)
usuarioSchema.methods.getRoleId = function() {
    return this.rol.map(role => roleIds[role]);
};

//metodo para validar contraseña
usuarioSchema.methods.encryptPassword = async password => {
    return bcrypt.hashSync(password,bcrypt.genSaltSync (10));
};
//metodo para comparar contraseñas
usuarioSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
};
//metodo para volver a encriptar la contraseña
usuarioSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}
//metodo para comparar contraseñas encriptadas
usuarioSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
};


/****ESTOS METODOS SON LOS QUE PUEDE HACER EL ADMINISTRADOR****/
//metodo para insertar un usuario
usuarioSchema.methods.insert = async function(){
   await this.save()
    .then(result => console.log(result))
    .catch(error => console.log(error));
};

//metodo para insertar una asignatura ESTE HAY Q LLAMAR AL DE LA CLASE ASIGNATURA
usuarioSchema.methods.insertAsignatura = async function(){
    await this.save()
    .then(result => console.log(result))
    .catch(error => console.log(error));
};

//metodo para eliminar un usuario
usuarioSchema.methods.delete = async function(id){
  const Usuario = mongoose.model("usuario", usuarioSchema);
    await this.deleteOne({_id:id})
    .then(result => console.log(result))
    .catch(error => console.log(error));
};

//metodo para asignar un rol TODAVIA NO HACE NADA
usuarioSchema.methods.asignarRol = async function(){//Tengo que tocarlo mas tarde//
   await this.save()
    .then(result => console.log(result))
    .catch(error => console.log(error));
};

//metodo para modificar un usuario
usuarioSchema.methods.update = async function(id, usuario){
   const Usuario = mongoose.model("usuario", usuarioSchema);
    await Usuario.updateOne({_id:id}, usuario)
     .then(result => console.log(result))
     .catch(error => console.log(error));
};

//metodo para buscar por email
usuarioSchema.methods.findByEmail = async function(email){
    const Usuario = mongoose.model("usuario", usuarioSchema);
    return await Usuario.findOne({"email": email})
    .then(result => console.log(result))
    .catch(error => console.log(error));
}
    
//metodo para asignar alumnos a una asignatura
usuarioSchema.methods.asignarAlumnos = async function(){
   
};

//metodo para asignar profesores a una asignatura
usuarioSchema.methods.asignarProfesores = async function(){
   
};
/****ESTOS METODOS LOS DEL PROFESOR  *****/

/****ESTOS METODOS LOS DEL ALUMNO  *****/






module.exports = mongoose.model('usuario', usuarioSchema);