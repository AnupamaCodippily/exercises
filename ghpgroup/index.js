const URL = "https://www.ghpgroupinc.com/product-details/DGPH101BR.html";

const axios = require("axios");
const htmlParser = require("node-html-parser");
const request = require("request");

async function fetchData(url, proxy) {
  try {
    const rawHtml = await axios({
      method: "get",
      url: url,
      proxy: (proxy !== undefined)
        ? {
            host: proxy.host,
            port: proxy.port,
          }
        : false,
    });

    const parsedHtml_root = htmlParser.parse(rawHtml.data.toString());

    const price = parsedHtml_root.querySelectorAll("[itemprop=price]")[0]
      .attributes.content;
    const vendor = parsedHtml_root.querySelectorAll("[itemprop=seller]")[0]
      .attributes.content;
    const inStock =
      parsedHtml_root.querySelectorAll("[itemprop=availability]")[0].attributes
        .content == "In Stock";
    const sku =
      parsedHtml_root.querySelectorAll("[itemprop=sku]")[0].attributes
        .content;
    const name = parsedHtml_root.querySelectorAll("[property=og:title]")[0]
      .attributes.content;

    const resultData = {
      name: name,
      vendor: vendor,
      inStock: inStock,
      price: price,
      sku: sku,
    };

    const result = {
      success: true,
      data: resultData,
    };

    return result;
  } catch (e) {
    console.log(`Error fetching or parsing data: ${e}`);
    return {
      success: false,
      data: null,
    };
  }
}

async function main() {
  const data = await fetchData(URL, undefined);
  console.log(data);
}

main();

module.exports.testableFunctions = {
  fetchData: fetchData,
};
