
function fetchDataAndLoadTable() {
    fetch('http://localhost:5000/getAll')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data.data)) { // Check if data.data is an array
                console.log(data.data);
                loadTable(data.data);
            } else {
                console.log("Invalid data format received from server.");
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

// to prevent the js from running before the html is loadeconst d
document.addEventListener('DOMContentLoaded', function () {
    fetchDataAndLoadTable();
});

// function to load the table with data from the database
function loadTable(data) {
    const table = document.querySelector('table tbody');
    let dataArray = [];
    console.log("Data : " + JSON.stringify(data));
    if (!Array.isArray(data)) {
        dataArray = [data];
    } else {
        dataArray = data; // Use the array directly
    }
    console.log("Data Array : " + JSON.stringify(dataArray) + " Length : " + dataArray.length);
    if (dataArray.length === 0 || dataArray.every(item => item === null) ) {
        table.innerHTML = "<tr><td class='noData' colspan='6'>No Data</td></tr>";
        return;
    }

    let tableHtml = "";

    dataArray.forEach(function ({ id, name, age, date_added }) {
        const date_formatted = formatDate(date_added);
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${name}</td>`;
        tableHtml += `<td>${age}</td>`;
        tableHtml += `<td>${date_formatted}</td>`;
        tableHtml += `<td><button class="deleteRowBtn" data-id=${id}>Delete</td>`;
        tableHtml += `<td><button class="editRowBtn" data-id=${id}>Edit</td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}

function formatDate(date) {
    const options = { year: '2-digit', month: '2-digit', day: '2-digit', hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true };
    const formattedDate = new Date(date).toLocaleString('en-US', options);
    return formattedDate;
}

// insert data to display in the table
const addInfoBtn = document.getElementById('addInfoBtn');

addInfoBtn.onclick = function () {
    const nameInput = document.getElementById('nameInput');
    const ageInput = document.getElementById('ageInput');
    console.log("Name : " + nameInput + " Age : " + ageInput);

    const name = nameInput.value;
    const age = ageInput.value;

    nameInput.value = "";
    ageInput.value = "";

    fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ name : name , age : age})
    })
    .then(response => response.json())
    .then(data => insertRowIntoTable(data['data']));
}

function insertRowIntoTable(data) {
    console.log(data);
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.noData');

    let tableHtml = "<tr>";

    for (var key in data) {
        console.log("Key : " + key);
        if (data.hasOwnProperty(key)) {
            if (key === 'date_added') {
                data[key] = formatDate(data[key]);
                console.log("Insert Date : " + data[key])
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }

    tableHtml += `<td><button class="deleteRowBtn" data-id=${data.id}>Delete</td>`;
    tableHtml += `<td><button class="editRowBtn" data-id=${data.id}>Edit</td>`;

    tableHtml += "</tr>";

    if (isTableData) {
        table.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}

document.querySelector('table tbody').addEventListener('click', function(event) {
    if (event.target.className === "deleteRowBtn") {
        deleteRowById(event.target.dataset.id);

    }
    if (event.target.className === "editRowBtn") {
        editRow(event.target.dataset.id);
    }
});

const updateBtn = document.querySelector('#updateRowBtn');
const searchBtn = document.querySelector('#searchBtn');

// search by id results
searchBtn.onclick = function() {
    const searchValue = document.querySelector('#searchInput').value;

    fetch('http://localhost:5000/get/' + searchValue)
    .then(response => response.json())
    .then(data => {
        if (data && data.hasOwnProperty('data')) {
            console.log(data);
            loadTable(data['data']);
        } else {
            console.log("No data or invalid response");
            loadTable([]); // Display an empty table
        }
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });
}

// delete row by id results
function deleteRowById(id) {
    fetch('http://localhost:5000/delete/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data) {
            fetchDataAndLoadTable();
        }
       
    });
}

const deleteAllBtn = document.querySelector('#deleteAllBtn');
// delete all results
deleteAllBtn.onclick = function() {
    fetch('http://localhost:5000/deleteAll', {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        fetchDataAndLoadTable();
    });
}


// edit row by id results
function editRow(id) {
    const updateSection = document.querySelector('#updateRow');
    updateSection.hidden = false;
    document.querySelector('#updateNameInput').dataset.id = id;
    document.querySelector('#updateAgeInput').dataset.id = id;
    
}
console.log(updateBtn);
updateBtn.onclick = function() {
    const updateNameInput = document.querySelector('#updateNameInput');
    const updateAgeInput = document.querySelector('#updateAgeInput');

    console.log("New Name : " + updateNameInput.value + " New Age : " + updateAgeInput.value);

    fetch('http://localhost:5000/update', {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            id: updateNameInput.dataset.id,
            name: updateNameInput.value,
            age: updateAgeInput.value
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("here")
        console.log(data);
        if (data) {
            console.log("in")
            // Hide the update section
            const updateSection = document.querySelector('#updateRow');
            updateSection.hidden = true;
            console.log("now")
            // Clear the input fields
            updateNameInput.value = "";
            updateAgeInput.value = "";

            // Reload the content
            fetchDataAndLoadTable();
        }
        console.log("out")
    })
    .catch(error => {
        console.error("Error updating data:", error);
    });
}

