// on the command line, mocha rest-api-automation.js to run the test
const axios = require('axios');

const BASE_URL = 'https://wise-adder-loyal.ngrok-free.app';
let userId;
let listId;
let itemId;

describe('To-Do App API Automation', function() {
  this.timeout(10000); 

  let expect;
  before(async function() {
    const chai = await import('chai');
    expect = chai.expect;
  });


  before(async function() {
    const newUser = {
      username: 'testuser',
      useremail: 'testuser@example.com',
      password: 'password123'
    };

    try {
      const response = await axios.post(`${BASE_URL}/signup`, newUser);
      if (response.data.signedup) {
        console.log('User signed up successfully');
      }
    } catch (error) {
      console.error('Error signing up user:', error.response ? error.response.data : error.message);
    }
  });


  after(async function() {
    try {
      await axios.delete(`${BASE_URL}/todolist/${userId}/${listId}`);
      console.log('To-do list deleted successfully');
    } catch (error) {
      console.error('Error deleting to-do list:', error.response ? error.response.data : error.message);
    }
  });

  // Test 1: User login
  it('log in', async function() {
    const loginUser = {
      useremail: 'testuser@example.com',
      password: 'password123'
    };

    const response = await axios.post(`${BASE_URL}/login`, loginUser);
    expect(response.status).to.equal(200);
    expect(response.data.authenticated).to.be.true;

    // Extracting user_id from login response
    // make sure the json data structure is correct
    // from LogIn.js (data.user) and from ToDoPage.js (user.user_id) => "data.user.user_id"
    userId = response.data.user.user_id;
  });

  // Test 2: create a new to-do list
  it('create a new to-do list', async function() {
    const newList = { listname: 'Test List' };
    const response = await axios.post(`${BASE_URL}/todolist/${userId}`, newList);
    expect(response.status).to.equal(201);

    listId = response.data.newListId;
  });

  // Test 3: retrieve to-do lists 
  it('get all to-do lists for the user', async function() {
    const response = await axios.get(`${BASE_URL}/todolist/${userId}`);
    expect(response.status).to.equal(200);
    expect(response.data).to.be.an('array');
    expect(response.data).to.have.lengthOf.at.least(1);
  });

  // Test 4: add a new to-do item
  it('should add a new to-do item to the list', async function() {
    const newItem = { itemname: 'Test Item' };
    const response = await axios.post(`${BASE_URL}/todoitem/${userId}/${listId}/Test Item`, newItem);
    expect(response.status).to.equal(201);

    itemId = response.data.newItemId;
  });

  // Test 5: retrieve to-do items in a list
  it('get all to-do items for the list', async function() {
    const response = await axios.get(`${BASE_URL}/todoitem/${userId}/${listId}`);
    expect(response.status).to.equal(200);
    expect(response.data).to.be.an('array');
    expect(response.data).to.have.lengthOf.at.least(1);
  });

  // Test 6: update a to-do item ({name: Doing item, status: doing, due_date:2024-06-01, complete_data: null})
  it('update a doing item', async function() {
    const updatedItem = {
      item_name: 'Doing Test Item',
      status: 'done',
      due_date: '2024-06-01',
      complete_date: null
    };

    const response = await axios.put(`${BASE_URL}/todoitem/${itemId}`, updatedItem);
    expect(response.status).to.equal(200);
  });

  // Test 7: update a to-do item ({name: Done item, status: doing, due_date:2024-06-01, complete_data: 2024-06-01})
  it('update a done item', async function() {
    const updatedItem = {
      item_name: 'Done Test Item',
      status: 'done',
      due_date: '2024-06-01',
      complete_date: '2024-06-01'
    };

    const response = await axios.put(`${BASE_URL}/todoitem/${itemId}`, updatedItem);
    expect(response.status).to.equal(200);
  });

  // Test 8: retrieve a specific to-do item
  it('get a specific to-do item', async function() {
    const response = await axios.get(`${BASE_URL}/todoitem/${itemId}`);
    expect(response.status).to.equal(200);
    expect(response.data).to.be.an('array');
    expect(response.data[0].item_name).to.equal('Done Test Item');
  });

  // Test 9: Negative test for retrieving a non-existent to-do item
  it('return 404 for a non-existent to-do item', async function() {
    try {
      await axios.get(`${BASE_URL}/todoitem/99999`);
    } catch (error) {
      expect(error.response.status).to.equal(404);
    }
  });

  // Test 10: delete a to-do item
  it('should delete a to-do item', async function() {
    const response = await axios.delete(`${BASE_URL}/todoitem/${itemId}`);
    expect(response.status).to.equal(200);
  });

  // Test 11: Negative test for deleting a non-existent to-do item
  it('return 404 for deleting a non-existent to-do item', async function() {
    try {
      await axios.delete(`${BASE_URL}/todoitem/99999`);
    } catch (error) {
      expect(error.response.status).to.equal(404);
    }
  });


  // Test 12: Negative test for deleting a non-existent to-do list
  it('should return 404 for deleting a non-existent to-do list', async function() {
    try {
      await axios.delete(`${BASE_URL}/todolist/${userId}/99999`);
    } catch (error) {
      expect(error.response.status).to.equal(404);
    }
  });

  // Test 13: egative test for creating a to-do list with an invalid user ID
  it('return 500 for creating a to-do list with an invalid user ID', async function() {
    const newList = { listname: 'Invalid List' };
    try {
      await axios.post(`${BASE_URL}/todolist/99999`, newList);
    } catch (error) {
      expect(error.response.status).to.equal(500);
    }
  });

  //Test 14: Negative test for logging in with incorrect credentials
  it('return 401 for logging in with incorrect credentials', async function() {
    const loginUser = {
      useremail: 'wronguser@example.com',
      password: 'wrongpassword'
    };

    try {
      await axios.post(`${BASE_URL}/login`, loginUser);
    } catch (error) {
      expect(error.response.status).to.equal(401);
    }
  });
});
