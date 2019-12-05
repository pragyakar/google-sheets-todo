import GoogleSpreadsheet from "google-spreadsheet";
import {promisify} from "util";
import uuid from "uuid/v4";
import creds from "../client_secret.json";
import sheet_props from "../sheet_properties.json";

const printTodo = (todo) => {
  console.log(`ID: ${todo.uid}`);
  console.log(`TODO : ${todo.todo}`);
  console.log(`STATUS : ${todo.status}`);
  console.log(`ADDED DATE : ${todo.addeddate}`);
  console.log(`---`);
}

const accessSpreadsheet = async () => {
  const doc = new GoogleSpreadsheet(sheet_props.sheet_id);
  await promisify(doc.useServiceAccountAuth)(creds);
  const info = await promisify(doc.getInfo)();
  const sheet = info.worksheets[0];
  return sheet;
}

export const getAllTodos = async () => {
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

export const getCompletedTodos = async () => {
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

export const getIncompleteTodos = async () => {
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

export const addNewTodo = async (newTodo) => {
  const sheet = await accessSpreadsheet();
  try {
    await promisify(sheet.addRow)({ uid: uuid(),  todo: newTodo, status: 'FALSE', addeddate: new Date().getTime()});
    console.log('Sucessfullyy added new TODO');
  } catch (error) {
    console.log('Failed to add new TODO');
  }
}

export const updateTodo = async (uid, updatedTodo) => {
  const sheet = await accessSpreadsheet();
  try {
    const rows = await promisify(sheet.getRows)({
      query: `uid = ${uid}`
    });

    rows.forEach(row => {
      row.todo = updatedTodo
      row.save();
    });
    console.log('Sucessfully updated TODO');
  } catch (error) {
    console.log(error);
  }
}

export const deleteTodo = async (uid) => {
  const sheet = await accessSpreadsheet();
  try {
    const rows = await promisify(sheet.getRows)({
      query: `uid = ${uid}`
    });

    rows[0].del();
    console.log('Sucessfully deleted TODO');
    
  } catch (error) {
    console.log(error);    
  }
}

export const setTodoAsCompleted = async (uid) => {
  const sheet = await accessSpreadsheet();
  try {
    const rows = await promisify(sheet.getRows)({
      query: `uid = ${uid}`
    });     

    rows.forEach(row => {
      if (row.status === 'FALSE') {
        row.status = 'TRUE',
        row.save();
        console.log('Sucessfully completed', row.todo);
      } else {
        console.log('TODO is already completed');
      }
    });
  } catch (error) {
    console.log(error);
  }
}

getAllTodos();
// getCompletedTodos();
// getIncompleteTodos();
// deleteTodo('08f71ed3-47e5-426c-8845-2aa8f5fb4ef2');
// addNewTodo('Another Fresh new todo');
// updateTodo('08f71ed3-47e5-426c-8845-2aa8f5fb4ef2', 'Updated TODO');
// setTodoAsCompleted('f151b10c-ff6b-44da-9939-98314324c555');
