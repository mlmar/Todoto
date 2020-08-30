import GenericService from './GenericService.js';

/*  UserService class middle tier
 *
 */
class ReminderService {
  constructor() {
    // endpoint, callback, data
    this.genericService = new GenericService();
  }

  addReminder(callback, query) {
    this.genericService.post("addReminder", callback, query);
  }

  getReminders(callback, query) {
    this.genericService.post("getReminders", callback, query);
  }

  deleteReminder(callback, query) {
    this.genericService.post("deleteReminder", callback, query);
  }

  deleteManyReminders(callback, query) {
    this.genericService.post("deleteManyReminders", callback, query);
  }
}

export default ReminderService;