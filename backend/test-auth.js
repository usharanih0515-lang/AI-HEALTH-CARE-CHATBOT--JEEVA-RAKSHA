const axios = require('axios');

async function testAuth() {
  const baseURL = 'http://localhost:5000/api/v1/auth';

  try {
    console.log('--- Testing Register ---');
    const regRes = await axios.post(`${baseURL}/register`, {
      email: 'test@example.com',
      fullName: 'Test Patient',
      firebaseToken: 'TEST_TOKEN_PATIENT',
      password: 'password123'
    });
    console.log('Register Success:', regRes.data);
  } catch (error) {
    console.log('Register Error:', error.response ? error.response.data : error.message);
  }

  try {
    console.log('\n--- Testing Login ---');
    const loginRes = await axios.post(`${baseURL}/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Login Success:', loginRes.data);
    
    if (loginRes.data.data && loginRes.data.data.token) {
      console.log('\n--- Testing Profile ---');
      const token = loginRes.data.data.token;
      const profileRes = await axios.get(`${baseURL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Profile Success:', profileRes.data);
    }
  } catch (error) {
    console.log('Login/Profile Error:', error.response ? error.response.data : error.message);
  }
}

testAuth();
