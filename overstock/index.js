const axios = require("axios");
const htmlParser = require("node-html-parser");

async function getInfo(url, proxy) {
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

  const parsedHtml = htmlParser.parse(res.data);

  // const priceSection = parsedHtml.querySelectorAll("")[0];
  const priceSection = parsedHtml.querySelector("#priceSection")
  const price = priceSection.querySelector("[itemprop=price]").attributes.content
  const vendor = parsedHtml.querySelector('#brand-name a').innerHTML
  const title = parsedHtml.querySelector('#productTitle .product-title h1').innerHTML
  const imgurl = parsedHtml.querySelector('#bd').querySelectorAll('img')[0].attributes.src

  const stock = parsedHtml.querySelector("#product-alerts-value-messages").querySelector(".out-of-stock-label") == null

  // console.log(price)

  // const price = priceSection.querySelector(".monetary-price-value").innerHTML;

  return {
    inStock: stock,
    details: {
      title: title,
      vendor: vendor,
      price: price,
      img: imgurl
    },
  };

  // console.log(res)
}

async function main() {
  const url =
    "https://www.overstock.com/Home-Garden/Stainless-Steel-Natural-Gas-Patio-Heater-N-A/27791856/product.html";
  const info = await getInfo(url, undefined);
  console.log(info);
}

main();
