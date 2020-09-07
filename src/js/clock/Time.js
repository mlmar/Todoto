class Time {
  constructor() {
    this.timeCreated = this.getTime(true);
    this.dateCreated = this.getDate();
  }

  // return date (yyyy/mm/dd) with padded 0's
  getDate(showYear = false) {
    var today = new Date();
    today = showYear ? 
      today.toLocaleDateString() :
      today.toLocaleDateString("en-US", { month: "numeric", day: "numeric" });

    today = today.replace(/\//g, '-');

    return today;
  }

  // return time with padded 0's
  getTime(showSeconds = false, showAMPM = false) {
    var today = new Date();
    today = showSeconds ? 
      today.toLocaleTimeString("en-US", { hour: "numeric", hour12: true, minute: "numeric", second: "numeric" }) :
      today.toLocaleTimeString("en-US", { hour: "numeric", hour12: true, minute: "numeric"});

    today = showAMPM ? today : today.replace("AM", "").replace("PM", "");

    return today;
  }

  getMilitaryTime(showSeconds = false) {
    var today = new Date();
    var hh = String(today.getHours()).padStart(2, "0");
    var mm = String(today.getMinutes()).padStart(2, "0");
    var ss = String(today.getSeconds()).padStart(2, "0");
    
    return showSeconds ? 
      hh + ":" + mm + ":" + ss : 
      hh + ":" + mm;
  }
}

export default Time;