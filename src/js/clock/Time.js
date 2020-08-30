class Time {
  constructor() {
    this.timeCreated = this.getTime(true);
    this.dateCreated = this.getDate();
  }

  // return date (yyyy/mm/dd) with padded 0's
  getDate(showYear = false, yearLast = false) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();

    today = showYear ? yyyy + "-" + mm + '-' + dd : mm + "-" + dd;
    today = yearLast ? mm + "-" + dd + "-" + yyyy : today;
    
    return today;
  }

  // return time with padded 0's
  getTime(showSeconds = false) {
    var today = new Date();
    var hh = String(today.getHours()).padStart(2, "0");
    var mm = String(today.getMinutes()).padStart(2, "0");
    var ss = String(today.getSeconds()).padStart(2, "0");

    // determine whether or not to show seconds
    var time = showSeconds ? hh + ":" + mm + ":" + ss : hh + ":" + mm;
    return time;
  }
}

export default Time;