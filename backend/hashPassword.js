const bcrypt = require('bcrypt');

async function hashPasswords() {
    const passwords = [
        'hod123',
        'faculty123',
        'student123'
    ];

    for (const password of passwords) {
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log(`Password: ${password}`);
        console.log(`Hash: ${hashedPassword}`);
        console.log('-----------------------------');
    }
}

hashPasswords();