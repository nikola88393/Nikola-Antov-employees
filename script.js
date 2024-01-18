function employee(EmpID, ProjectId, Duration) {
    return {
        EmpID,
        ProjectId,
        Duration
    }
}

function calculateDuration(date1, date2) {
    let startDate = new Date(date1);
    let endDate = null;

    if (date2 === 'NULL') {
        endDate = new Date();
    }
    else {
        endDate = new Date(date2);
    }

    let time = endDate.getTime() - startDate.getTime();

    if (time < 0) {
        return
    }

    let days = Math.round(time / (1000 * 3600 * 24));

    return days;
}

function readFile() {
    let file = document.getElementById('myFile').files[0];

    if (file) {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function (event) {
            let csv = event.target.result;
            let rows = csv.split('\n');
            let objContainer = [];

            for (let i = 0; i < rows.length - 1; i++) {
                cols = rows[i].split(',');
                if (isNaN(cols[0]) || isNaN(cols[1])) {
                    continue;
                }
                else {
                    objContainer.push(employee(cols[0], cols[1], calculateDuration(cols[2], cols[3])));
                }
            }

            let result = findPair(objContainer);
            console.log(result)
            populateDOM(result);
        }
    }

    else {
        alert('No file selected');
    }
}

function findPair(data) {
    let result = [];
    let maxDuration = 0;
    let firstObj = null;
    let secondObj = null;

    for (let j = 0; j < data.length; j++) {
        for (let i = j + 1; i < data.length; i++) {
            let duration = data[j]['Duration'] + data[i]['Duration'];
            if (data[j]['ProjectId'] === data[i]['ProjectId'] && duration > maxDuration) {
                maxDuration = duration;
                firstObj = employee(data[j]['EmpID'], data[j]['ProjectId'], data[j]['Duration']);
                secondObj = employee(data[i]['EmpID'], data[i]['ProjectId'], data[i]['Duration']);
            }
        }
    }

    if (firstObj && secondObj) {
        let firstIndex = data.findIndex(obj => obj.EmpID === firstObj.EmpID && obj.ProjectId === firstObj.ProjectId);
        let secondIndex = data.findIndex(obj => obj.EmpID === secondObj.EmpID && obj.ProjectId === secondObj.ProjectId);

        if (firstIndex !== -1 && secondIndex !== -1) {
            data.splice(firstIndex, 1);
            data.splice(secondIndex, 1);

            result.push(firstObj, secondObj);

            result = result.concat(findPair(data));
        }
    }

    return result;
}

function populateDOM(result) {
    let h1 = document.getElementById('tableH1');
    h1.innerHTML = 'Resulting table';

    let container = document.getElementById('table');

    let tbl = document.createElement('table');
    let body = document.createElement('tbody');

    let row = document.createElement('tr');

    let cellEmpID1 = document.createElement('th');
    let cellEmpID2 = document.createElement('th');
    let cellProjectID = document.createElement('th');
    let cellDuration = document.createElement('th');

    cellEmpID1.innerHTML = 'EmpID 1';
    cellEmpID2.innerHTML = 'EmpID 2';
    cellProjectID.innerHTML = 'ProjectID';
    cellDuration.innerHTML = 'Days worked';

    row.appendChild(cellEmpID1);
    row.appendChild(cellEmpID2);
    row.appendChild(cellProjectID);
    row.appendChild(cellDuration);

    body.appendChild(row);


    for (let j = 0; j < result.length; j += 2) {
        let row = document.createElement('tr');

        let cellEmpID1 = document.createElement('td');
        let cellEmpID2 = document.createElement('td');
        let cellProjectID = document.createElement('td');
        let cellDuration = document.createElement('td');

        cellEmpID1.innerHTML = result[j]['EmpID'];
        cellEmpID2.innerHTML = result[j + 1]['EmpID'];
        cellProjectID.innerHTML = result[j]['ProjectId'];
        cellDuration.innerHTML = result[j]['Duration'] + result[j + 1]['Duration'];

        row.appendChild(cellEmpID1);
        row.appendChild(cellEmpID2);
        row.appendChild(cellProjectID);
        row.appendChild(cellDuration);

        body.appendChild(row);
    }

    tbl.appendChild(body);
    tbl.setAttribute('border', '2');

    container.appendChild(tbl);
}

const readBtn = document.getElementById('readFile');
readBtn.addEventListener('click', readFile);



