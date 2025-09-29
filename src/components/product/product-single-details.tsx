import React, { useState, useRef, useEffect, useMemo } from 'react';
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
import { useQuery } from "@tanstack/react-query";
import { Product } from "@framework/types";
import Loading from "@components/common/Loading";

// Product Gallery Component
const ProductGalleryComponent = ({ gallery, mainImage }) => {
  const [selectedImage, setSelectedImage] = useState(mainImage || (gallery?.[0]?.image));
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const images = gallery && gallery.length > 0 ? gallery : [{ image: mainImage }];

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  return (
    <div className="col-span-5 grid grid-cols-[120px_1fr] gap-4">
      {/* Thumbnail Column */}
      <div className="flex flex-col gap-3">
        {images.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(item.image)}
            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
              selectedImage === item.image
                ? 'border-gray-900'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <img
              src={item.image}
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image with Zoom */}
      <div className="relative bg-gray-50 rounded-lg overflow-hidden">
        <div
          ref={imageRef}
          className="relative w-full aspect-square cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={selectedImage}
            alt="Product"
            className="w-full h-full object-contain"
          />
          
          {/* Zoom Overlay */}
          {isZoomed && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url(${selectedImage})`,
                backgroundSize: '200%',
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                backgroundRepeat: 'no-repeat',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Main Product Component
const ProductSingleDetails = () => {
  const {
    query: { slug },
  } = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [attributes, setAttributes] = useState({});
  const [viewCartBtn, setViewCartBtn] = useState(false);
  const [addToCartLoader, setAddToCartLoader] = useState(false);
  const { addItemToCart } = useCart();

  // Fetch product
  const { data, isLoading } = useQuery({
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
  const handleAttribute = (attr) => {
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

    const item = generateCartItem(data, attributes);
    addItemToCart(item, quantity);
    console.log("cart item", item);
  };

  if (isLoading || !data) return <Loading />;

  return (
    <div className="block lg:grid grid-cols-9 gap-x-10 xl:gap-x-14 pt-7 pb-10 lg:pb-14 2xl:pb-20 items-start">
      <ProductGalleryComponent gallery={data.gallery} mainImage={data.image} />
      
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
          {/* Color Attributes */}
          <ProductAttributes
            title="colors"
            attributes={availableColors}
            active={attributes.colors}
            onClick={handleAttribute}
          />

          {/* Size Attributes - Only show if sizes available for selected color */}
          {availableSizes.length > 0 && (
            <ProductAttributes
              title="sizes"
              attributes={availableSizes}
              active={attributes.sizes}
              onClick={handleAttribute}
            />
          )}
        </div>

        <div className="flex items-center gap-x-4 ltr:md:pr-32 rtl:md:pl-32 ltr:lg:pr-12 rtl:lg:pl-12 ltr:2xl:pr-32 rtl:2xl:pl-32 ltr:3xl:pr-48 rtl:3xl:pl-48 border-b border-gray-300 py-8">
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
          </ul>
        </div>
      </div>
      
    </div>
  );
};

export default ProductSingleDetails;