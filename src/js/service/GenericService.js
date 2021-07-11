const host = process.env.REACT_APP_DEV ? "http://localhost:3300/" : "https://todoto-auth.vercel.app/";


/*  GenericService class
 *
 */
class GenericService {
  
  post(endpoint, callback, data) {
    fetch(host + endpoint, {
      method: 'post',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify(data)

    })
    .then(response => response.json())
    .then(result => {
      callback(result);
    })
    .catch(error => {
      console.error(error);
    });
  }

  get(endpoint, callback) {
    fetch(host + endpoint, {
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(result => {
      callback(result);
    })
    .catch(error => {
      console.error(error)
    });
  }
}

export default GenericService;