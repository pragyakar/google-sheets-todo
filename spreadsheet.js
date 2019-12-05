const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');
const creds = require('./client_secret.json');
const sheet_props = require('./sheet_properties.json');
const uuid = require('uuid/v4');

printTodo = (todo) => {
  console.log(`ID: ${todo.uid}`);
  console.log(`TODO : ${todo.todo}`);
  console.log(`STATUS : ${todo.status}`);
  console.log(`ADDED DATE : ${todo.addeddate}`);
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
    orderBy: 'status'
  });

  rows.forEach(todo => {
    printTodo(todo);
    // console.log(todo);
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

addNewTodo = async (newTodo) => {
  const sheet = await accessSpreadsheet();
  try {
    await promisify(sheet.addRow)({ uid: uuid(),  todo: newTodo, status: 'FALSE', addeddate: new Date().getTime()});
    console.log('Sucessfullyy added new TODO');
  } catch (error) {
    console.log('Failed to add new TODO');
  }
}

// TODO: Update TODO
// TODO: Delete TODO
// TODO: Set TODO as completed

getAllTodos();
// addNewTodo('Fresh new todo');
