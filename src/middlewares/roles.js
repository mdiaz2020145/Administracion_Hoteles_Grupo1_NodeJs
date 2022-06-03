exports.verAdministrador=function(req, res, next) {
    if(req.user.rol!=="ADMIN") return res.status(403).send({mensaje: "Solo el administrador puede continuar"});

    next();
}

exports.verUsuario=function(req, res, next) {
    if(req.user.rol!=="USUARIO") return res.status(403).send({mensaje: "Solo el usuario puede continuar"});

    next();
}

exports.verSuperAdmin=function(req, res, next) {
    if(req.user.rol!=="SUPERADMIN") return res.status(403).send({mensaje: "Solo el administrador del programa puede continuar"});

    next();
}