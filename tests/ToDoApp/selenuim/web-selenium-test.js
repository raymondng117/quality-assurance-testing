const { Builder, By, until, Key } = require('selenium-webdriver');

BASE_URL = 'https://raymondng117.github.io/react-todo-app-static/#/'

async function runSeleniumTest() {
    let driver = await new Builder().forBrowser('chrome').build();

    // methods to locate elements instead of using 'id':
    // await driver.findElement(By.linkText('sign up')).click();
    // await driver.findElement(By.partialLinkText('sign up')).click();
    // await driver.findElement(By.cssSelector('a.fw-bold')).click();
    // await driver.findElement(By.xpath("//a[contains(@class, 'fw-bold') and text()='sign up']")).click();

    try {
        await driver.get(BASE_URL);

        // Sign up
        await driver.findElement(By.id('signUpLink')).click();
        await driver.findElement(By.id('username')).sendKeys('testuser4');
        await driver.findElement(By.id('useremail')).sendKeys('testuser4@example.com');
        await driver.findElement(By.id('password')).sendKeys('password123');
        await driver.findElement(By.id('signupBtn')).click();
        // Wait for redirection to the sign-in page
        await driver.wait(until.urlIs(BASE_URL), 10000); 

        // Sign in
        await driver.findElement(By.id('useremail')).sendKeys('testuser4@example.com');
        await driver.findElement(By.id('password')).sendKeys('password123');
        await driver.findElement(By.id('loginBtn')).click();
        await driver.wait(until.urlIs(BASE_URL + 'todopage'), 10000);

        // Verify todo list addition
            // Add todo list 'testing list 1'
            let toDoInputBox
            await driver.findElement(By.id('toDoListInputButton')).click();
            toDoInputBox = await driver.findElement(By.id('toDoListInput'));
            await toDoInputBox.sendKeys('testing list 1', Key.RETURN);
            // Wait for list creation
            await driver.sleep(500);
            // Add todo list 'testing list 2'
            await driver.findElement(By.id('toDoListInputButton')).click();
            toDoInputBox = await driver.findElement(By.id('toDoListInput'));
            await toDoInputBox.sendKeys('testing list 2', Key.RETURN);
            // Wait for list creation
            await driver.sleep(500);
            // Add todo list 'testing list 3'
            await driver.findElement(By.id('toDoListInputButton')).click();
            toDoInputBox = await driver.findElement(By.id('toDoListInput'));
            await toDoInputBox.sendKeys('testing list 3', Key.RETURN);
            await driver.sleep(500);

        // Verify todo list deletion
            // toggle list delete button to activate deletion
            await driver.findElement(By.id('toDoListDeleteButton')).click();
            // delete "testing list 2"
            try {
                let listNames = [];
                // Find the list row containing the list item with text 'testing list 1'
                let listRow = await driver.findElement(By.xpath(`//div[contains(@class, 'list-row') and .//div[contains(@class, 'list-item') and text()='testing list 2']]`));
                // Find the delete icon within the list row
                let deleteIcon = await listRow.findElement(By.css('.deleteicon'));
                // Perform a click on the delete icon
                await deleteIcon.click();
                // Wait for list deletion
                await driver.sleep(500);
                let lists = await driver.findElements(By.css('.list-row'));
                for (let list of lists) {
                    let listItem = await list.findElement(By.css('.list-item'));
                    let text = await listItem.getText();
                    listNames.push(text);
                }
                if (!listNames.includes('testing list 2')) {
                    console.log('Testing list 2 has been deleted.')
                }
            } catch (error) {
                // Handle errors, such as if the list row or delete icon is not found
                console.error('Error while deleting list item:', error);
            }
            // toggle list delete button to activate deletion
            await driver.findElement(By.id('toDoListDeleteButton')).click();

        // Verify todo item addition
            // Find the list row containing the list item with text 'testing list 3'
            let listRow = await driver.findElement(By.xpath(`//div[contains(@class, 'list-item') and text()='testing list 3']`));
            await listRow.click();
            await driver.sleep(500);
            // Add todoitem 'testing item 1'
            await driver.findElement(By.id('toDoItemInputButton')).click();
            toDoInputBox = await driver.findElement(By.id('toDoItemInput'));
            await toDoInputBox.sendKeys('testing item 1', Key.RETURN);
            await driver.sleep(500);
            // Add todoitem 'testing item 2'
            await driver.findElement(By.id('toDoItemInputButton')).click();
            toDoInputBox = await driver.findElement(By.id('toDoItemInput'));
            await toDoInputBox.sendKeys('testing item 2', Key.RETURN);
            await driver.sleep(500);

            // Add todoitem 'testing item 3'
            await driver.findElement(By.id('toDoItemInputButton')).click();
            toDoInputBox = await driver.findElement(By.id('toDoItemInput'));
            await toDoInputBox.sendKeys('testing item 3', Key.RETURN);
            await driver.sleep(500);

        // Verify todo item edition
            // select "testing item 2" todo item to edit
            let secondToDoItemEditButton = await driver.findElement(By.xpath(`//tbody[@id='toDoItemTable']//tr[contains(@class, 'todo-item-row') and .//th[contains(@class, 'item-number') and text()='2']]//div[contains(@class, 'editButton')]`));
            await secondToDoItemEditButton.click();
            await driver.sleep(1000);
            // update it to doing item
            await driver.findElement(By.id('itemName')).clear();
            await driver.findElement(By.id('itemName')).sendKeys('doing item');
            await driver.findElement(By.id('itemStatus')).sendKeys('doing');
            await driver.findElement(By.id('saveUpdatedItemButton')).click();
            await driver.sleep(1000);

            let thirdToDoItemEditButton = await driver.findElement(By.xpath(`//tbody[@id='toDoItemTable']//tr[contains(@class, 'todo-item-row') and .//th[contains(@class, 'item-number') and text()='2']]//div[contains(@class, 'editButton')]`));
            await thirdToDoItemEditButton.click();
            await driver.sleep(1000);

            // update todoitem to done item
            await driver.findElement(By.id('itemName')).clear();
            await driver.findElement(By.id('itemName')).sendKeys('done item');
            await driver.findElement(By.id('itemStatus')).sendKeys('done');
            await driver.sleep(1000);
            await driver.findElement(By.id('saveUpdatedItemButton')).click();
            await driver.sleep(1000);


        // verify todo item deletion
            await driver.findElement(By.id('toDoItemDeleteButton')).click();
            await driver.sleep(500);
            // delete todo item
            let toDoItemDeleteButton = await driver.findElement(By.xpath(`//tbody[@id='toDoItemTable']//tr[contains(@class, 'todo-item-row') and .//th[contains(@class, 'item-number') and text()='1']]//div[contains(@class, 'deleteButton')]`));
            toDoItemDeleteButton.click();
            await driver.sleep(500);
            // delete doing item
            let doingItemDeleteButton = await driver.findElement(By.xpath(`//tbody[@id='doingItemTable']//tr[contains(@class, 'doing-item-row') and .//th[contains(@class, 'item-number') and text()='1']]//div[contains(@class, 'deleteButton')]`));
            doingItemDeleteButton.click();
            await driver.sleep(500);
            // delete done item
            let doneItemDeleteButton = await driver.findElement(By.xpath(`//tbody[@id='doneItemTable']//tr[contains(@class, 'done-item-row') and .//th[contains(@class, 'item-number') and text()='1']]//div[contains(@class, 'deleteButton')]`));
            doneItemDeleteButton.click();
            await driver.sleep(500);

            // toggle deletebutton
            await driver.findElement(By.id('toDoListDeleteButton')).click();
            await driver.sleep(500);
            // delete "testing list 1"
            try {
                let listNames = [];
                // Find the list row containing the list item with text 'testing list 1'
                let listRow = await driver.findElement(By.xpath(`//div[contains(@class, 'list-row') and .//div[contains(@class, 'list-item') and text()='testing list 1']]`));
                // Find the delete icon within the list row
                let deleteIcon = await listRow.findElement(By.css('.deleteicon'));
                // Perform a click on the delete icon
                await deleteIcon.click();
                // Wait for list deletion
                await driver.sleep(500);
                let lists = await driver.findElements(By.css('.list-row'));
                for (let list of lists) {
                    let listItem = await list.findElement(By.css('.list-item'));
                    let text = await listItem.getText();
                    listNames.push(text);
                }
                if (!listNames.includes('testing list 2')) {
                    console.log('Testing list 1 has been deleted.')
                }
            } catch (error) {
                // Handle errors, such as if the list row or delete icon is not found
                console.error('Error while deleting list item:', error);
            }

            // delete "testing list 3"
            try {
                let listNames = [];
                // Find the list row containing the list item with text 'testing list 1'
                let listRow = await driver.findElement(By.xpath(`//div[contains(@class, 'list-row') and .//div[contains(@class, 'list-item') and text()='testing list 3']]`));
                // Find the delete icon within the list row
                let deleteIcon = await listRow.findElement(By.css('.deleteicon'));
                // Perform a click on the delete icon
                await deleteIcon.click();
                // Wait for list deletion
                await driver.sleep(500);
                let lists = await driver.findElements(By.css('.list-row'));
                for (let list of lists) {
                    let listItem = await list.findElement(By.css('.list-item'));
                    let text = await listItem.getText();
                    listNames.push(text);
                }
                if (!listNames.includes('testing list 2')) {
                    console.log('Testing list 3 has been deleted.')
                }
            } catch (error) {
                // Handle errors, such as if the list row or delete icon is not found
                console.error('Error while deleting list item:', error);
            }
            await driver.findElement(By.id('toDoListDeleteButton')).click();

        // Close the browser
        await driver.sleep(500);
        await driver.quit();
    } catch (error) {
        console.error('Error during Selenium test:', error);
        await driver.quit();
    }
}

runSeleniumTest();
