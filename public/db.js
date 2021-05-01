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

  function saveRecord(record) {
    // create a transaction on the pending db with readwrite access
    const transaction = db.transaction(["pending"], "readwrite");
    // access your pending object store
    const store = transaction.objectStore("pending");
    // add record to your store with add method.
    store.add(record);
  }

  function checkDatabase() {
    db = request.result; // is this right?
    // open a transaction on your pending db
    const transaction = db.transaction(["budget"], "readwrite");
    // access your pending object store
    const budgetStore = transaction.objectStore("budget");
    // get all records from store and set to a variable
    const getAll = store.getAll();
    const budgetIndex = budgetStore.index("budgetIndex");