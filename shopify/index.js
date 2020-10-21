const axios = require("axios");
const { parse } = require("node-html-parser");

// URLS for fetching the actual item
const URL_PRODUCT =
  "https://shop.firesense.com/collections/products/products/42-wall-mounted-electric-fireplace.json";
const URL_PRODUCT_NO_CACHE =
  "https://shop.firesense.com/collections/products/products/42-wall-mounted-electric-fireplace.json?limit=250%24%7BDate.now()%7D";

// Fetches the json object from products json
async function getInfo(url, proxy) {
  const result = null;

  try {
    const json_data = await axios({
      method: "get",
      url: url,
      proxy: proxy
        ? {
            host: proxy.host,
            port: proxy.port,
          }
        : undefined,
    });

    if (json_data.data.product.variants[0].inventory_quantity > 0) {
      return {
        inStock: true,
        details: {
          title: json_data.data.product.title,
          sku: json_data.data.product.variants[0].sku,
          vendor: json_data.data.product.vendor,
          price: json_data.data.product.variants[0].price,
          img :  json_data.data.product.image.src,
        },
      };
    } else {
      return {
        inStock: false,
        details: {},
      };
    }
    
  } catch (err) {
    console.log(err);
  }
}

async function main() {
  const info = await getInfo(URL_PRODUCT_NO_CACHE, undefined);
  console.log(info);
}

main();

module.exports.testableFunctions = {
  getInfo: getInfo,
};
