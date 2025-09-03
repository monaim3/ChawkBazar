import React from "react";
import { TbTruckDelivery } from "react-icons/tb";
import { MdOutlineAssignmentReturn } from "react-icons/md";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { BiSupport } from "react-icons/bi";

const FeaturesSection = () => {
    const features = [
        {
            id: 1,
            icon: <TbTruckDelivery className="w-12 h-12 text-gray-400" />,
            title: "FASTEST SHIPPING COUNTRYWIDE",
            description: "Get your orders delivered quickly across the country"
        },
        {
            id: 2,
            icon: <MdOutlineAssignmentReturn className="w-12 h-12 text-gray-400" />,
            title: "EASY RETURN POLICY",
            description: "Hassle-free returns within 30 days"
        },
        {
            id: 3,
            icon: <HiOutlineShieldCheck className="w-12 h-12 text-gray-400" />,
            title: "PREMIUM QUALITY PRODUCT",
            description: "Authentic products with quality guarantee"
        },
        {
            id: 4,
            icon: <BiSupport className="w-12 h-12 text-gray-400" />,
            title: "ONLINE SUPPORT 24/7",
            description: "Round-the-clock customer support"
        }
    ];

    return (
        <section className="py-12 ">
            <div className="container mx-auto px-4 md:px-8 lg:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            className="flex flex-col items-center text-center p-3  rounded-lg border border-gray-400 hover:shadow-md transition-shadow duration-300"
                        >
                            <div className="mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-sm font-medium text-gray-800 uppercase tracking-wide mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;