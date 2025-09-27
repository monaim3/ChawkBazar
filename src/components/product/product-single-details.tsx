import React, { useEffect, useMemo, useState } from "react";
import Button from "@components/ui/button";
import Counter from "@components/common/counter";
import { useRouter } from "next/router";
import { getVariations } from "@framework/utils/get-variations";
import usePrice from "@framework/product/use-price";
import { useCart } from "@contexts/cart/cart.context";
import { generateCartItem } from "@utils/generate-cart-item";
import { ProductAttributes } from "./product-attributes";
import isEmpty from "lodash/isEmpty";
import Link from "@components/ui/link";
import { toast } from "react-toastify";
import { useWindowSize } from "@utils/use-window-size";
import Carousel from "@components/ui/carousel/carousel";
import { SwiperSlide } from "swiper/react";
import ProductMetaReview from "@components/product/product-meta-review";
import { useSsrCompatible } from "@utils/use-ssr-compatible";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@framework/types";
import Loading from "@components/common/Loading";

const productGalleryCarouselResponsive = {
  "768": {
    slidesPerView: 2,
  },
  "0": {
    slidesPerView: 1,
  },
};

const ProductSingleDetails: React.FC = () => {
  const {
    query: { slug },
  } = useRouter();
  const { width } = useSsrCompatible(useWindowSize(), { width: 0, height: 0 });

  const [quantity, setQuantity] = useState(1);
  const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
  const [viewCartBtn, setViewCartBtn] = useState(false);
  const [addToCartLoader, setAddToCartLoader] = useState(false);
  const { addItemToCart } = useCart();
  // Fetch product
  const { data, isLoading } = useQuery<Product>({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await fetch(`https://app.cirqlsync.com/syncing-application/syncapi/product/${slug}`);
      return await res.json();
    },
    enabled: !!slug,
  });


  // Extract variations & prices
  const variations = getVariations(data?.variations || {});
  const prices = data?.prices || [];

  // Colors for UI
  const availableColors = useMemo(() => data?.variations?.colors || [], [data]);

  // Sizes for currently selected color
  const availableSizes = useMemo(() => {
    if (!attributes.colors) return [];
    const colorObj = prices.find(p => p.color === attributes.colors);
    if (!colorObj) return [];
    return colorObj.sizes.map(s => ({ id: s.size_id, value: s.size }));
  }, [attributes.colors, prices]);

  // Default selections
  useEffect(() => {
    // Default first color
    if (!attributes.colors && availableColors.length) {
      setAttributes(prev => ({
        ...prev,
        colors: availableColors[0].value,
      }));
    }

    // Default first size for selected color
    if (attributes.colors && availableSizes.length) {
      setAttributes(prev => ({
        ...prev,
        sizes: availableSizes[0].value,
      }));
    } else if (attributes.colors) {
      setAttributes(prev => ({ ...prev, sizes: "" }));
    }
  }, [availableColors, attributes.colors, availableSizes]);

  // Price calculation
  const selectedPrice = useMemo(() => {
    if (!attributes.colors) return Number(data?.finalPrice);

    const colorObj = prices.find(p => p.color === attributes.colors);
    if (!colorObj) return Number(data?.finalPrice);

    if (!attributes.sizes) return Number(colorObj.sizes[0]?.price ?? data?.finalPrice);

    const sizeObj = colorObj.sizes.find(s => s.size === attributes.sizes);
    return Number(sizeObj?.price ?? data?.finalPrice);
  }, [attributes.colors, attributes.sizes, prices, data?.finalPrice]);

  // Price hook
  const { price, basePrice, discount } = usePrice({
    amount: selectedPrice ?? Number(data?.finalPrice),
    baseAmount: Number(data?.basePrice),
    currencyCode: "USD",
  });

  // Attribute selection
  const handleAttribute = (attr: any) => {
    setAttributes(prev => ({ ...prev, ...attr }));
  };

  // Add to cart
  const addToCart = () => {
    if (!isEmpty(variations) && !Object.keys(attributes).length) return;

    setAddToCartLoader(true);
    setTimeout(() => {
      setAddToCartLoader(false);
      setViewCartBtn(true);
      toast.success("Item added successfully!");
    }, 500);

    const item = generateCartItem(data!, attributes);
    addItemToCart(item, quantity);
    console.log("cart item", item);
  };

  // Navigation
  // const navigateToProductPage = () => {
  //   closeModal();
  //   router.push(`${ROUTES.PRODUCT}/${data?.id || id}`);
  // };
  // const navigateToCartPage = () => {
  //   closeModal();
  //   setTimeout(() => openCart(), 300);
  // };

  if (isLoading || !data) return <Loading />;
  return (
    <div className="block lg:grid grid-cols-9 gap-x-10 xl:gap-x-14 pt-7 pb-10 lg:pb-14 2xl:pb-20 items-start">
      {width < 1025 ? (
        <Carousel
          pagination={{
            clickable: true,
          }}
          breakpoints={productGalleryCarouselResponsive}
          className="product-gallery"
          buttonGroupClassName="hidden"
        >
          {data?.gallery?.map((item, index: number) => (
            <SwiperSlide key={`product-gallery-key-${index}`}>
              <div className="col-span-1 transition duration-150 ease-in hover:opacity-90">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    item?.image ??
                    "/assets/placeholder/products/product-gallery.svg"
                  }
                  alt={`${data?.name}--${index}`}
                  className="object-cover w-full"
                />
              </div>
            </SwiperSlide>
          ))}
        </Carousel>
      ) : (
        <div className="col-span-5 grid grid-cols-2 gap-2.5">
          {data?.gallery?.map((item, index: number) => (
            <div
              key={index}
              className="col-span-1 transition duration-150 ease-in hover:opacity-90"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  item?.image ??
                  "/assets/placeholder/products/product-gallery.svg"
                }
                alt={`${data?.name}--${index}`}
                className="object-cover w-full"
              />
            </div>
          ))}
        </div>
      )}

      <div className="col-span-4 pt-8 lg:pt-0">
        <div className="pb-7 mb-7 border-b border-gray-300">
          <h2 className="text-heading text-lg md:text-xl lg:text-2xl 2xl:text-3xl font-bold hover:text-black mb-3.5">
            {data?.name}
          </h2>
          <p className="text-body text-sm lg:text-base leading-6 lg:leading-8">
            {data?.description}
          </p>
          <div className="flex items-center mt-5">
            <div className="text-heading font-bold text-base md:text-xl lg:text-2xl 2xl:text-4xl ltr:pr-2 rtl:pl-2 ltr:md:pr-0 rtl:md:pl-0 ltr:lg:pr-2 rtl:lg:pl-2 ltr:2xl:pr-0 rtl:2xl:pl-0">
              {price}
            </div>
            {discount && (
              <span className="line-through font-segoe text-gray-400 text-sm md:text-base lg:text-lg xl:text-xl ltr:pl-2 rtl:pr-2">
                {basePrice}
              </span>
            )}
          </div>
        </div>

        <div className="pb-3 border-b border-gray-300">
          {Object.keys(variations).map((variation) => {
            return (
              <ProductAttributes
                key={variation}
                title={variation}
                attributes={variations[variation]}
                active={attributes[variation]}
                onClick={handleAttribute}
              />
            );
          })}
        </div>
        <div className="flex items-center gap-x-4 ltr:md:pr-32 rtl:md:pl-32 ltr:lg:pr-12 rtl:lg:pl-12 ltr:2xl:pr-32 rtl:2xl:pl-32 ltr:3xl:pr-48 rtl:3xl:pl-48  border-b border-gray-300 py-8">
          <Counter
            quantity={quantity}
            onIncrement={() => setQuantity((prev) => prev + 1)}
            onDecrement={() =>
              setQuantity((prev) => (prev !== 1 ? prev - 1 : 1))
            }
            disableDecrement={quantity === 1}
          />
          <Button
            onClick={addToCart}
            variant="flat"
            className={`w-full h-11 md:h-12 px-1.5`}
            loading={addToCartLoader}
          >
            <span className="py-2 3xl:px-8">Add to cart</span>
          </Button>
        </div>
        <div className="py-6">
          <ul className="text-sm space-y-5 pb-1">

            <li>
              <span className="font-semibold text-heading inline-block ltr:pr-2 rtl:pl-2">
                Category:
              </span>
              <Link
                href="/"
                className="transition hover:underline hover:text-heading"
              >
                {data?.category?.name}
              </Link>
            </li>
            {/* {data?.tags && Array.isArray(data.tags) && (
              <li className="productTags">
                <span className="font-semibold text-heading inline-block ltr:pr-2 rtl:pl-2">
                  Tags:
                </span>
                {data.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={tag.slug}
                    className="inline-block ltr:pr-1.5 rtl:pl-1.5 transition hover:underline hover:text-heading ltr:last:pr-0 rtl:last:pl-0"
                  >
                    {tag.name}
                    <span className="text-heading">,</span>
                  </Link>
                ))}
              </li>
            )} */}
          </ul>
        </div>

        {/* <ProductMetaReview data={data} /> */}
      </div>
    </div>
  );
};

export default ProductSingleDetails;
