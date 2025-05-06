const baseUrl = 'http://localhost:3030/api';

fetch(`${baseUrl}/user`)
  .then(res => res.json())
  .then(data => console.log('fetch', data))
  .catch(err => console.log(err)); 
