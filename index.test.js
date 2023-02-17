const { sequelize } = require('./db');
const { Restaurant, Menu } = require('./models/index');
const {
  seedRestaurant,
  seedMenu,
} = require('./seedData');
const { Items } = require('./models/index');


describe('Restaurant and Menu Models', () => {
  /**
   * Runs the code prior to all tests
   */
  beforeAll(async () => {
    // the 'sync' method will create tables based on the model class
    // by setting 'force:true' the tables are recreated each time the 
    // test suite is run
    await sequelize.sync({ force: true });

    // seed the database with restaurants and menus
    await Promise.all([
      ...seedRestaurant.map((rest) => Restaurant.create(rest)),
      ...seedMenu.map((menu) => Menu.create(menu)),
    ]);
  });

  test('can create a restaurant', async () => {
    const testRestaurant = await Restaurant.create({
      name: 'test',
      location: 'city',
      cuisine: 'japanese',
    });
    expect(testRestaurant.name).toBe('test');
    expect(testRestaurant.location).toBe('city');
    expect(testRestaurant.cuisine).toBe('japanese');
  });

  test('can create a Menu', async () => {
    const testMenu = await Menu.create({ title: 'title' });
    expect(testMenu.title).toBe('title');
  });

  test('can find Restaurants', async () => {
    const foundRest = await Restaurant.findAll({
      where: {
        name: 'Spice Grill',
        location: 'Houston',
        cuisine: 'Indian',
      },
    });
    expect(foundRest.length).toBe(1);
  });
  test('can find Menu', async () => {
    const testMenu1 = await Menu.create({ title: 'title' });
    const testMenu2 = await Menu.create({ title: 'test2' });
    const foundMenu = await Menu.findAll({
      where: {
        title: 'title',
      },
    });
    expect(foundMenu[0].title).toBe('title');
  }); 

  test('can delete Restaurants', async () => {
    // create a test restaurant
    const testRestaurant = await Restaurant.create({
      name: 'test1',
      location: 'city1',
      cuisine: 'chinese',
    });
  
    // delete the test restaurant and wait for the operation to complete
    await testRestaurant.destroy();
  
    // try to find the test restaurant
    const foundRest = await Restaurant.findOne({
      where: {
        name: 'test1',
      },
    });
  
    // assert that the test restaurant was deleted
    expect(foundRest).toBeFalsy();
  });


  test('can find Menu', async () => {
    const testMenu1 = await Menu.create({ title: 'title' });
    const testMenu2 = await Menu.create({ title: 'test2' });
    const foundMenu = await Menu.findAll({
      where: {
        title: 'title',
      },
    });
    expect(foundMenu[0].title).toBe('title');
  }); 
  test("restaurant can have many menus", async () => {
    const testMenu = await Menu.create ({ title: 'test' })
    const testRest = await Restaurant.create ({name: 'abc', location: 'bcd', cuisine: 'chinese' })
    await testRest.addMenu(testMenu)
    const fetchedRest = await testRest.reload()
    const fetchedMenu = await fetchedRest.getMenus()
    expect (fetchedMenu[0]['title']).toContain('test')
  })
  test("many to many between items and menus", async () => {
    const testMenu = await Menu.create ({title: 'testMenu'})
    const testItem = await Items.create({name: 'abc', image: 'str', price: 3, vegetarian: false});

    
  })
  test('can find all menus and their items', async () => {
    // Create a test menu and add some items to it
    const testMenu = await Menu.create({ title: 'Test Menu' });
    await testMenu.createItem({ name: 'Item 1', price: 10.99 });
    await testMenu.createItem({ name: 'Item 2', price: 15.99 });
    await testMenu.createItem({ name: 'Item 3', price: 20.99 });
  
    // Find all menus and their items
    const menus = await Menu.findAll({
      include: [Items],
    });
  
    // Check that the correct data was returned
    expect(menus.length).toBeGreaterThan(0);
    const testMenuResult = menus.find((menu) => menu.title === 'Test Menu');
  expect(testMenuResult).toBeDefined();
  if (testMenuResult) {
    const items = testMenuResult.Items;
    expect(items.length).toBe(3);
    expect(items[0].name).toBe('Item 1');
    expect(items[0].price).toBe(10.99);
    expect(items[1].name).toBe('Item 2');
    expect(items[1].price).toBe(15.99);
    expect(items[2].name).toBe('Item 3');
    expect(items[2].price).toBe(20.99);
  }
  });
});

