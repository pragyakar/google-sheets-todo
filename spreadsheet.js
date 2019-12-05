const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');
const creds = require('./client_secret.json');

getId = (fullId) => {
  const idArray = fullId.split('/');
  const id = idArray[idArray.length - 1];
  return id;
}

printTodo = (todo) => {
  console.log(`ID: ${getId(todo.id)}`);
  console.log(`TODO : ${todo.todo}`);
  console.log(`STATUS : ${todo.status}`);
  console.log(`---`);
}

accessSpreadsheet = async () => {
  const doc = new GoogleSpreadsheet('1KypeAsKIdpZU7TI7GNVj4YEY-rSQ851Aqsp3c_2VaFw');
  await promisify(doc.useServiceAccountAuth)(creds);
  const info = await promisify(doc.getInfo)();
  const sheet = info.worksheets[0];
  
  const rows  = await promisify(sheet.getRows) ({
    offset: 1,
    // limit: 5,
    // orderBy: 'todo',
    // query: 'status = TRUE'
  });

  // Print List
  rows.forEach(todo => {
    printTodo(todo);
  });

}

accessSpreadsheet();