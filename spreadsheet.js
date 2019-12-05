const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');
const creds = require('./client_secret.json');
const sheet_props = require('./sheet_properties.json');

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
  const doc = new GoogleSpreadsheet(sheet_props.sheet_id);
  await promisify(doc.useServiceAccountAuth)(creds);
  const info = await promisify(doc.getInfo)();
  const sheet = info.worksheets[0];
  return sheet;
}

getAllTodos = async () => {
  const sheet = await accessSpreadsheet();
  const rows  = await promisify(sheet.getRows) ({
    offset: sheet_props.header_offset,
    limit: 5,
    orderBy: 'status'
  });

  rows.forEach(todo => {
    printTodo(todo);
  });

  console.log(`Displaying all ${rows.length} TODOs`);
}

getCompletedTodos = async () => {
  const sheet = await accessSpreadsheet();
  const rows = await promisify(sheet.getRows) ({
    offset: sheet_props.header_offset,
    query: 'status = TRUE'
  });

  rows.forEach(todo => {
    printTodo(todo);
  });

  console.log(`Displaying ${rows.length} completed TODOs`);
}

getIncompleteTodos = async () => {
  const sheet = await accessSpreadsheet();
  const rows = await promisify(sheet.getRows) ({
    offset: sheet_props.header_offset,
    query: 'status = FALSE'
  });

  rows.forEach(todo => {
    printTodo(todo);
  });

  console.log(`Displaying ${rows.length} incomplete TODOs`);
}

getAllTodos();
