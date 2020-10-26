const { testableFunctions } = require("./index");
const path = require('path')

// Note: you may need to change this to a product with no stock/ with stock
const URL = "https://www.ghpgroupinc.com/product-details/DGPH101BR.html";
const localUrl = path.join(__dirname, 'testing.html')

// Testing with a known out of stock product
test("if the fetchData function returns the expected result (that the product is not in stock, or if it is in stock, with details) ", async () => {
  const data = await testableFunctions.fetchData(URL, undefined);
  const successTemplate = {
    success: expect.any(Boolean),
    data: expect.any(
        Object,
        {
          name: expect.any(String),
          vendor: expect.any(String),
          inStock: expect.any(Boolean),
          price: expect.any(String),
          sku: expect.any(String),
        },
    )
  };

  const failureTemplate = {
    success: false,
    data: null,
  };
  await expect(data).toMatchObject(expect.objectContaining(successTemplate));
});
