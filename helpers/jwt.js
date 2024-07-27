const jwt = require('jsonwebtoken');

const generarJWT = (uid, name) => {

    return new Promise( (resolve, reject) => {

        const payload = {uid, name};
        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h' //2 hours
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('Could not genrate JWT');
            }
            resolve(token);
        });
    });
}


module.exports = {
    generarJWT
}