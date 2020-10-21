const axios = require("axios");
const { parse } = require("node-html-parser");

const TARGET_URL =
  "https://www.costco.com/lasko-24-inch-ceramic-tower-heater-with-full-circle-warmth.product.100677931.html";

const pricedivname = "#pull-right-price";
const skudivname = "#product-body-item-number";

async function getInfo(url, proxy) {
  try {
    const res = await axios({
      method: "get",
      url: url,
      proxy: proxy
        ? {
            host: proxy.host,
            port: proxy.port,
          }
        : undefined,
    });

    const html_data = parse(res.data.toString());

    //   search for out of stock (oos) button
    const out_of_stock_btn = html_data.querySelector(".oos-overlay");
    const sku = html_data.querySelector("#product-body-item-number span")
      .innerHTML;
    if (out_of_stock_btn !== undefined) {
      return {
        inStock: true,
        details: {
          title: html_data.querySelector(".product-h1-container-v2 h1")
            .innerHTML,
          sku: sku,
          vendor: "Costco",
          price: html_data.querySelectorAll("meta").filter((tag) => {
            return tag.attributes["property"] == "product:price:amount";
          })[0].attributes["content"],
          img: `https://images.costco-static.com/ImageDelivery/imageService?profileId=12026540&itemId=${sku}-847&recipeName=344`,
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

  return null;
}

async function main() {
  const result = await getInfo(TARGET_URL, undefined);
  console.log(result);
}

main();

module.exports.testables = {
  getInfo: getInfo,
};
