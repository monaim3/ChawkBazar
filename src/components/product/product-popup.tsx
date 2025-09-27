import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";
import { ROUTES } from "@utils/routes";
import { useUI } from "@contexts/ui.context";
import Button from "@components/ui/button";
import Counter from "@components/common/counter";
import { useCart } from "@contexts/cart/cart.context";
import { ProductAttributes } from "@components/product/product-attributes";
import { generateCartItem } from "@utils/generate-cart-item";
import usePrice from "@framework/product/use-price";
import { getVariations } from "@framework/utils/get-variations";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@framework/types";
import Loading from "@components/common/Loading";

export default function ProductPopup() {
  const { modalData: { id }, closeModal, openCart } = useUI();
  const router = useRouter();
  const { addItemToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
  const [viewCartBtn, setViewCartBtn] = useState(false);
  const [addToCartLoader, setAddToCartLoader] = useState(false);

  // Fetch product
  const { data, isLoading } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await fetch(`https://app.cirqlsync.com/syncing-application/syncapi/product/${id}`);
      return await res.json();
    },
    enabled: !!id,
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
  const navigateToProductPage = () => {
    closeModal();
    router.push(`${ROUTES.PRODUCT}/${data?.id || id}`);
  };
  const navigateToCartPage = () => {
    closeModal();
    setTimeout(() => openCart(), 300);
  };

  if (isLoading || !data) return <Loading />;
  return (
    <div className="rounded-lg bg-white">
      <div className="flex flex-col lg:flex-row w-full md:w-[650px] lg:w-[960px] mx-auto overflow-hidden">
        {/* Product Image */}
        <div className="flex-shrink-0 flex items-center justify-center w-full lg:w-[430px] max-h-[430px] lg:max-h-full overflow-hidden bg-gray-300">
          <img
            src={data.image || "/assets/placeholder/products/product-thumbnail.svg"}
            alt={data.name}
            className="lg:object-cover lg:w-full lg:h-full"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col p-5 md:p-8 w-full">
          <div className="pb-5">
            <div onClick={navigateToProductPage} role="button">
              <h2 className="text-heading text-lg md:text-xl lg:text-2xl font-semibold hover:text-black">
                {data.name}
              </h2>
            </div>
            <p className="text-sm leading-6 md:text-body md:leading-7">
              {data.description}
            </p>

            <div className="flex items-center mt-3">
              <div className="text-heading font-semibold text-base md:text-xl lg:text-2xl">
                {price}
              </div>
              {discount && (
                <del className="font-segoe text-gray-400 text-base lg:text-xl pl-2.5">
                  {basePrice}
                </del>
              )}
            </div>
          </div>

          {/* Variations */}
          <ProductAttributes
            title="colors"
            attributes={availableColors}
            active={attributes.colors}
            onClick={handleAttribute}
          />

          <ProductAttributes
            title="sizes"
            attributes={availableSizes}
            active={attributes.sizes}
            onClick={handleAttribute}
          />

          {/* Quantity & Cart Buttons */}
          <div className="pt-2 md:pt-4">
            <div className="flex items-center justify-between mb-4 gap-x-3">
              <Counter
                quantity={quantity}
                onIncrement={() => setQuantity(q => q + 1)}
                onDecrement={() => setQuantity(q => (q !== 1 ? q - 1 : 1))}
                disableDecrement={quantity === 1}
              />
              <Button
                onClick={addToCart}
                variant="flat"
                className={`w-full h-11 md:h-12 px-1.5`}
                loading={addToCartLoader}
              >
                Add to Cart
              </Button>
            </div>

            {viewCartBtn && (
              <button
                onClick={navigateToCartPage}
                className="w-full mb-4 h-11 md:h-12 rounded bg-gray-100 border border-gray-300 hover:bg-gray-50"
              >
                View Cart
              </button>
            )}

            <Button onClick={navigateToProductPage} variant="flat" className="w-full h-11 md:h-12">
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
