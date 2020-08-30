import GenericService from './GenericService.js';

class GoogleAuthService {
  constructor() {
    this.genericService = new GenericService();
  }

  verifyUser(callback, user) {
    this.genericService.post("verifyUser", callback, user);
  }

  
}

export default GoogleAuthService;