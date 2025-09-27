// import isEmpty from "lodash/isEmpty";

// interface Item {
//   id: string | number;
//   name: string;
//   slug: string;
//   image: {
//     thumbnail: string;
//     [key: string]: unknown;
//   };
//   price: number;
//   sale_price?: number;
//   [key: string]: unknown;
// }
// export function generateCartItem(item: Item, attributes: object) {
//   console.log("generate cart item", item);
//   const { id, name, slug, image, price, sale_price } = item;
//   return {
//     id: !isEmpty(attributes)
//       ? `${id}.${Object.values(attributes).join(".")}`
//       : id,
//     name,
//     slug,
//     image: image.thumbnail,
//     price: sale_price ? sale_price : price,
//     attributes,
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

export function generateCartItem(item: Item, attributes: object) {
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

  // Normalize price
  const price = sale_price
    ? sale_price
    : finalPrice
      ? Number(finalPrice)
      : basePrice
        ? Number(basePrice)
        : 0;

  return {
    id, // only product id
    name,
    slug: slug ?? String(id), // fallback if slug missing
    image: imageUrl,
    price,
    attributes, // keep selected attributes for display
  };
}
