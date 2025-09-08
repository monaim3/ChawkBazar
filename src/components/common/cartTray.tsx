import { useCart } from "@contexts/cart/cart.context";
import { useUI } from "@contexts/ui.context";
import usePrice from "@framework/product/use-price";
import { HiOutlineShoppingBag } from "react-icons/hi";

const CartTray = () => {
    const { openCart } = useUI();
    const { totalItems, total } = useCart();
    function handleCartOpen() {
        return openCart();
    }
    const { price: cartTotal } = usePrice({
        amount: total,
        currencyCode: 'USD',
    });
    console.log("cartTotal", cartTotal);
    return (
        <>
            <div
                style={{
                    color: "#fff",
                    border: `1px solid "#A98153"`,
                }}
                className={`cart fixed top-1/2 mt-16 md:mt-0 right-0 cursor-pointer z-20 rounded-s-md overflow-hidden }`}
                onClick={handleCartOpen}
            >
                <div
                    className="icon p-2 pb-0 text-center "
                    style={{
                        color: "#fff",
                        backgroundColor: "#FF8029"
                    }}
                >
                    {/* <BsCart3 size={28} className="m-1" /> */}
                    <HiOutlineShoppingBag size={28} className="" style={{ color: "#fff" }} />
                    <p className="text-sm mt-1" style={{ color: "#fff" }}>
                        {totalItems} ITEMS
                    </p>
                </div>
                <hr className="border-slate-200" ></hr>
                <div
                    className="text-center p-2"
                    style={{ backgroundColor: "#000" }}
                >

                    <div className="text-sm font-semibold flex gap-1 items-center justify-center" style={{ color: "#fff" }}>
                        {/* <p>{siteConfig.currency.shortForm}</p> */}
                        {/* <span>৳</span> */}
                        <span className="animate-countup">	{cartTotal || "0.00"}</span>

                    </div>
                </div>
            </div>
        </>
    );
};

export default CartTray;
