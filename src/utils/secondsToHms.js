function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
  
    var hDisplay = h > 0 ? h + (h == 1 ? "h " : "h ") : "0h ";
    var mDisplay = m > 0 ? m + (m == 1 ? "m " : "m ") : "0m ";
    var sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : "0s";
    return hDisplay + mDisplay + sDisplay; 
}
  
export default secondsToHms;