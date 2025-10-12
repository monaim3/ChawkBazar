import BannerCard from "@components/common/banner-card";
import Container from "@components/ui/container";
import BrandGridBlock from "@containers/brand-grid-block";
import CategoryBlock from "@containers/category-block";
import Layout from "@components/layout/layout";
import BannerWithProducts from "@containers/banner-with-products";
import BannerBlock from "@containers/banner-block";
import Divider from "@components/ui/divider";
import DownloadApps from "@components/common/download-apps";
import Support from "@components/common/support";
import Instagram from "@components/common/instagram";
import ProductsFlashSaleBlock from "@containers/product-flash-sale-block";
import ProductsFeatured from "@containers/products-featured";
import BannerSliderBlock from "@containers/banner-slider-block";
import ExclusiveBlock from "@containers/exclusive-block";
import Subscription from "@components/common/subscription";
import NewArrivalsProductFeed from "@components/product/feeds/new-arrivals-product-feed";
import { homeThreeBanner as banner } from "@framework/static/banner";
import { homeThreeMasonryBanner as masonryBanner } from "@framework/static/banner";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ROUTES } from "@utils/routes";
import { GetStaticProps } from "next";
import IntroSlider from "@components/common/IntroSlider";
import FeaturesSection from "@components/common/FeaturesSection";
import CategoriesSection from "@components/common/CategoriesSection";
import NewArrivalSection from "@components/product/new-arrival";
import BestSelling from "@components/product/best-selling";
import CartTray from "@components/common/cartTray";
import FeatureBanner from "@components/common/feature-banner";
import Hero from "@components/common/hero";
import Threebanner from './../components/common/threebanner';
import Categoriesone from "@components/common/categoriesone";
import CategoriesTwo from "@components/common/categoriestwo";
import CategoriesThree from "@components/common/categoriesthree";
import Video from "@components/common/video";

export default function Home() {
  return (
    <>
      <IntroSlider></IntroSlider>
      <FeaturesSection></FeaturesSection>
      <CategoriesSection></CategoriesSection>
      <NewArrivalSection />
      <BestSelling />
      <CartTray />
      <Video></Video>
      <FeatureBanner />
      {/* <BannerSliderBlock /> */}
      {/* <CategoriesThree></CategoriesThree> */}
      <Hero></Hero>
      <Threebanner></Threebanner>
      <Categoriesone></Categoriesone>
      <CategoriesTwo></CategoriesTwo>


      {/* <CategoryBlock
          sectionHeading="text-shop-by-category"
          type="rounded"
        />
        <ProductsFeatured
          sectionHeading="text-featured-products"
          limit={5}
        />
        <BannerCard
          key={`banner--key${banner[0].id}`}
          banner={banner[0]}
          href={`${ROUTES.COLLECTIONS}/${banner[0].slug}`}
          className="mb-12 lg:mb-14 xl:mb-16 pb-0.5 lg:pb-1 xl:pb-0"
        /> */}
      {/* <BrandGridBlock sectionHeading="text-top-brands" /> */}
      {/* <BannerCard
          key={`banner--key${banner[1].id}`}
          banner={banner[1]}
          href={`${ROUTES.COLLECTIONS}/${banner[1].slug}`}
          className="mb-12 lg:mb-14 xl:mb-16 pb-0.5 lg:pb-1 xl:pb-0"
        /> */}
      {/* <BannerWithProducts
          sectionHeading="text-on-selling-products"
          categorySlug="/search"
        /> */}
      {/* <ExclusiveBlock /> */}
      {/* <NewArrivalsProductFeed /> */}
      {/* <DownloadApps /> */}
      {/* <Support /> */}
      {/* <Instagram /> */}
      <Subscription />

      <Divider className="mb-0" />
    </>
  );
}

Home.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common", "forms", "menu", "footer"])),
    },
  };
};
