const { testableFunctions } = require("./index");

// Note: you may need to change this to a product with no stock
const TEST_URL_1 = "https://shop.firesense.com/collections/products/products/61491.json?limit=250%24%7BDate.now()%7D"
const TEST_URL_2 = "https://shop.firesense.com/collections/products/products/36-wall-mounted-electric-fireplace.json?limit=250%24%7BDate.now()%7D"

// Testing with a known out of stock product
test("if the getInf(url, proxy) function returns the expected result (that the product is not in stock) ", async () => {
  const data = await testableFunctions.getInfo(TEST_URL_1, undefined);
  expect(data).toStrictEqual({ inStock: false, details: {} });
});


// Testing with a know in stock product
test("if the getInf(url, proxy) function returns the expected result (that the product is not in stock) ", async () => {
    const data = await testableFunctions.getInfo(TEST_URL_2, undefined);
    expect(data).toStrictEqual({
        inStock: true,
        details: {
          title: '36" Wall Mounted Electric Fireplace',
          sku: '62905',
          vendor: 'Fire Sense',
          price: '299.99',
          img: 'https://cdn.shopify.com/s/files/1/0979/8032/products/62905_cutout1b.jpg?v=1548966051'
        }
      });
});