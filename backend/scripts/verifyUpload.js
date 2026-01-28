const fs = require('fs');

const log = (msg) => {
    console.log(msg);
    fs.appendFileSync('verify_result.txt', msg + '\n');
};

const main = async () => {
    // Clear previous log
    fs.writeFileSync('verify_result.txt', 'Starting Verification...\n');

    // Wait for server restart (just in case)
    await new Promise(r => setTimeout(r, 1000));

    try {
        log('1. Login...');
        const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@example.com', password: 'Admin123!' })
        });
        const loginData = await loginRes.json();

        if (!loginData.success) {
            log('Login failed: ' + loginData.message);
            process.exit(1);
        }

        const token = loginData.data.token;
        log('Login successful.');

        // 2. Upload Dataset
        log('2. Uploading Dataset...');
        const uploadRes = await fetch('http://localhost:5000/api/v1/admin/datasets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                type: 'helium10',
                category: 'Verification Test',
                data: [{ keyword: 'verify_key', vol: 999 }]
            })
        });

        const uploadData = await uploadRes.json();
        log('Upload Response: ' + JSON.stringify(uploadData));

        if (uploadData.success) {
            log('VERIFICATION SUCCESS');
        } else {
            log('VERIFICATION FAILED');
        }
        process.exit(0);

    } catch (err) {
        log('Script Error: ' + err.message);
        if (err.cause) log('Cause: ' + err.cause);
        process.exit(1);
    }
}
main();
