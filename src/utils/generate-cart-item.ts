// // import isEmpty from "lodash/isEmpty";

// // interface Item {
// //   id: string | number;
// //   name: string;
// //   slug: string;
// //   image: {
// //     thumbnail: string;
// //     [key: string]: unknown;
// //   };
// //   price: number;
// //   sale_price?: number;
// //   [key: string]: unknown;
// // }
// // export function generateCartItem(item: Item, attributes: object) {
// //   console.log("generate cart item", item);
// //   const { id, name, slug, image, price, sale_price } = item;
// //   return {
// //     id: !isEmpty(attributes)
// //       ? `${id}.${Object.values(attributes).join(".")}`
// //       : id,
// //     name,
// //     slug,
// //     image: image.thumbnail,
// //     price: sale_price ? sale_price : price,
// //     attributes,
// //   };
// // }




// import isEmpty from "lodash/isEmpty";

// interface Item {
//   id: string | number;
//   name: string;
//   slug?: string;
//   image?: string | { thumbnail: string };
//   basePrice?: string | number;
//   finalPrice?: string | number;
//   sale_price?: number;
//   [key: string]: unknown;
// }

// export function generateCartItem(item: Item, attributes: object, amount?: number) {
//   const {
//     id,
//     name,
//     slug,
//     image,
//     basePrice,
//     finalPrice,
//     sale_price,
//   } = item;
//   // Normalize image
//   const imageUrl =
//     typeof image === "string" ? image : image?.thumbnail ?? null;

//   // Normalize price
//   // const price = sale_price
//   //   ? sale_price
//   //   : finalPrice
//   //     ? Number(finalPrice)
//   //     : basePrice
//   //       ? Number(basePrice)
//   //       : 0;

//   const price=amount?.toString().split("$")[1]
//   return {
//     id, // only product id
//     name,
//     slug: slug ?? String(id), // fallback if slug missing
//     image: imageUrl,
//     price,
//     attributes, // keep selected attributes for display
//   };
// }


import isEmpty from "lodash/isEmpty";

interface Item {
  id: string | number;
  name: string;
  slug?: string;
  image?: string | { thumbnail: string };
  basePrice?: string | number;
  finalPrice?: string | number;
  sale_price?: number;
  [key: string]: unknown;
}

export function generateCartItem(item: Item, attributes: object, amount?: number) {
  const {
    id,
    name,
    slug,
    image,
    basePrice,
    finalPrice,
    sale_price,
  } = item;

  // Normalize image
  const imageUrl =
    typeof image === "string" ? image : image?.thumbnail ?? null;

  // Normalize price - use amount if provided, otherwise fallback to other prices
  let price: number;

  if (amount !== undefined && amount !== null) {
    price = Number(amount);
  } else if (sale_price) {
    price = Number(sale_price);
  } else if (finalPrice) {
    price = Number(finalPrice);
  } else if (basePrice) {
    price = Number(basePrice);
  } else {
    price = 0;
  }

  // Safety check: ensure price is a valid number
  if (isNaN(price)) {
    console.warn("Invalid price calculated:", { amount, sale_price, finalPrice, basePrice });
    price = 0;
  }

  // Generate unique ID based on product + variations
  // This ensures different sizes/colors are treated as separate cart items
  const cartItemId = !isEmpty(attributes)
    ? `${id}.${Object.values(attributes).join(".")}`
    : id;

  return {
    id: cartItemId, // unique ID including variations
    name,
    slug: slug ?? String(id),
    image: imageUrl,
    price, // proper number
    attributes, // keep selected attributes for display
  };
}