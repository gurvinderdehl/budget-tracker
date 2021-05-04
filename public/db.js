let db;
// Create new db request for a 'budget' db
const request = indexedDB.open('budget', 1);
request.onupgradeneeded = (event) => {
    // Create object store called "pending" and set autoIncrement to true
    const db = event.target.result;
    db.createObjectStore('pending', {
        autoIncrement: true
    });
};
request.onsuccess = (event) => {
    db = event.target.result;
    // Return online status of the browser 
    // True if online, false if offline
    if (navigator.onLine) {
        checkDatabase();
    }
};
request.onerror = (event) => {
    // Log error in case of error
    console.log("Oops! " + event.target.errorCode);
};
function saveRecord(record) {
    // Create a transaction on the pending db with readwrite access
    const transaction = db.transaction(['pending'], 'readwrite');
    // Access pending object store
    const store = transaction.objectStore('pending');
    // Add record to store
    store.add(record);
};
function checkDatabase() {
    db = request.result;
    // Open a transaction on pending db
    const transaction = db.transaction(['pending'], 'readwrite');
    // Access the pending object store
    const store = transaction.objectStore('pending');
    // Get all records from store and set to a variable
    const getAll = store.getAll();
    getAll.onsuccess = () => {
        if (getAll.result.length > 0) {
            fetch('api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then((response) => response.json())
            .then(() => {
                // If successful, open a transaction in pending db
                const transaction = db.transaction(['pending'], 'readwrite');
                // Access pending object store
                const store = transaction.objectStore('pending');
                // Clear all items in the store
                store.clear();
            });
        }
    };
};
window.addEventListener('online', checkDatabase);