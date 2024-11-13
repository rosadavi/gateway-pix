import bcrypt from 'bcrypt';

export function generateHash(texto: string) {
    const salt = 10;
    bcrypt.hash(texto, salt, function(err, hash) {
        return hash;
    });
}
