const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Create a test image file
const testImagePath = path.join(__dirname, 'test-upload.png');
const pngHeader = Buffer.from([
  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
  0x00, 0x00, 0x00, 0x0D,
  0x49, 0x48, 0x44, 0x52,
  0x00, 0x00, 0x00, 0x01,
  0x00, 0x00, 0x00, 0x01,
  0x08, 0x02, 0x00, 0x00, 0x00,
  0x90, 0x77, 0x53, 0xDE,
  0x00, 0x00, 0x00, 0x0C,
  0x49, 0x44, 0x41, 0x54,
  0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0xFE, 0xFF,
  0x00, 0x00, 0x00, 0x02, 0x00, 0x01,
  0x4B, 0xB6, 0xEE, 0x56,
  0x00, 0x00, 0x00, 0x00,
  0x49, 0x45, 0x4E, 0x44,
  0xAE, 0x42, 0x60, 0x82
]);

fs.writeFileSync(testImagePath, pngHeader);
console.log('Created test image');

// Get admin token first
axios.post('http://localhost:5000/api/auth/login', {
  email: 'admin@promptcraftery.com',
  password: 'Admin@123456'
})
.then(res => {
  const token = res.data.token;
  const promptId = '69ea2a80ce400768bdfd3b9d'; // Feynman Technique Explainer
  
  console.log('Token received:', token.substring(0, 20) + '...');
  
  // Create form data
  const form = new FormData();
  form.append('resultImage', fs.createReadStream(testImagePath));
  
  // Upload image
  return axios.post(
    `http://localhost:5000/api/prompts/${promptId}/upload-image`,
    form,
    {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    }
  );
})
.then(res => {
  console.log('✅ Upload successful!');
  console.log('Response:', res.data);
})
.catch(err => {
  console.error('❌ Upload failed');
  console.error('Status:', err.response?.status);
  console.error('Error:', err.response?.data || err.message);
})
.finally(() => {
  fs.unlinkSync(testImagePath);
});
