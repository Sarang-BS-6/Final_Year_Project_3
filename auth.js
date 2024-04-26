const bcrypt = require('bcrypt')

const hashPass = (pass) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(12, (err, salt) => {
            if (err){
                reject(err)
            }
            bcrypt.hash(pass, salt, (err, hash)=>{
                if(err){
                    reject(err)
                }
                resolve(hash)
            })
        })
    })
}

const comparePass = (password, hashed)=>{
    return bcrypt.compare(password, hashed)
}

module.exports = {
    hashPass,
    comparePass
}