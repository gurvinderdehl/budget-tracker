let db;
// create a new db request for a "budget" database.
const request = window.indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
    // create object store called "pending" and set autoIncrement to true
    const db = event.target.result;
    db.createObjectStore("pending", {
      autoIncrement: true 
    });
  };

  //Checking the status of the browser to see if it's online 
  request.onsuccess = function (event) {
    db = event.target.result;
    if (navigator.onLine) {
      checkDatabase();
    }
  };

  request.onerror = function (event) {
    // log error here
    console.log("Oops! "+ event.target.errorCode);
  };