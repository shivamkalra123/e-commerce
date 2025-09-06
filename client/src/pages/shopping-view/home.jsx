import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { getFeatureImages } from "@/store/common-slice";

import ShoppingProductTile from "@/components/shopping-view/product-tile";
import ProductDetailsDialog from "@/components/shopping-view/product-details";

// Example images
import menImage from "/men.jpg";
import womenImage from "/women.png";
import kidsImage from "/kids.webp";
import accessoriesImage from "/accessories.webp";

const categoriesWithImage = [
  { id: "men", label: "Men", image: menImage },
  { id: "women", label: "Women", image: womenImage },
  { id: "kids", label: "Kids", image: kidsImage },
  { id: "accessories", label: "Accessories", image: accessoriesImage },
];

const brandsWithImage = [
  { id: "nike", label: "Nike", image: "https://i.pinimg.com/564x/2b/d2/5a/2bd25a29fc238ec571985e13c7f5647c.jpg" },
  { id: "adidas", label: "Adidas", image: "/adidas.jpg" },
  { id: "puma", label: "Puma", image: "https://1000logos.net/wp-content/uploads/2017/05/PUMA-Logo-1978-1980-500x281.png" },
  { id: "levi", label: "Levi's", image: "https://media.designrush.com/inspiration_images/758941/conversions/1-desktop.jpg" },
  { id: "zara", label: "Zara", image: "https://download.logo.wine/logo/Zara_(retailer)/Zara_(retailer)-Logo.wine.png" },
  { id: "h&m", label: "H&M", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/1200px-H%26M-Logo.svg.png" },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { productList, productDetails } = useSelector((s) => s.shopProducts);
  const { featureImageList = [] } = useSelector((s) => s.commonFeature || {});
  const { user } = useSelector((s) => s.auth || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const heroSlides = useMemo(
    () =>
      featureImageList.length
        ? featureImageList
        : [
            { image: "/fashion-banner.png", title: "New Arrivals", subtitle: "Trendy fits for everyone" },
            { image: "/banner-2.jpg", title: "Streetwear Heat", subtitle: "Own the city vibe" },
            { image: "/banner-3.jpg", title: "Luxury Picks", subtitle: "Because you deserve it" },
          ],
    [featureImageList]
  );

  const totalSlides = heroSlides.length;

  const handleNavigateToListingPage = (item, section) => {
    sessionStorage.setItem("filters", JSON.stringify({ [section]: [item.id] }));
    navigate("/shop/listing");
  };

  const handleAddToCart = (productId) => {
    if (!user?.id) {
      toast({ title: "Please sign in to add items", variant: "destructive" });
      return;
    }
    dispatch(addToCart({ userId: user.id, productId, quantity: 1 })).then((res) => {
      if (res?.payload?.success) {
        dispatch(fetchCartItems(user.id));
        toast({ title: "Added to cart 🛒" });
      }
    });
  };

  const handleGetProductDetails = (productId) => {
    dispatch(fetchProductDetails(productId));
  };

  useEffect(() => {
    if (productDetails) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" }));
    dispatch(getFeatureImages());
  }, [dispatch]);

  useEffect(() => {
    if (!totalSlides) return;
    const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % totalSlides), 8000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* HERO SECTION - Modern Design */}
      <div className="relative h-[85vh] overflow-hidden">
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              i === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-110"
            }`}
          >
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center justify-start">
              <div className="ml-16 text-white space-y-6 max-w-xl">
                <h1 className="text-6xl font-bold tracking-tight">Get 60% Off Using ABC200</h1>
                <p className="text-xl text-gray-200 font-light">Avail Now</p>
                <Button
                  size="lg"
                  className="rounded-md px-10 py-6 text-lg bg-white text-black hover:bg-gray-100 transition-all duration-300 mt-4 shadow-lg"
                  onClick={() => navigate("/shop/listing")}
                >
                  Shop Collection
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === currentSlide ? "bg-white scale-125" : "bg-white/50"
              }`}
              onClick={() => setCurrentSlide(i)}
            />
          ))}
        </div>
      </div>
      <section className="py-10 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">Editor's Picks</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our fashion experts' favorite selections this month
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="h-full rounded-2xl overflow-hidden group cursor-pointer relative">
                <img 
                  src="https://hips.hearstapps.com/hmg-prod/images/nike-running-shoes-67bc80dc79961.jpg?crop=1xw:0.75xh;center,top&resize=1200:*" 
                  alt="Editor's pick"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                  <span className="text-sm font-medium bg-white text-black px-3 py-1 rounded-full">Featured</span>
                  <h3 className="text-2xl font-bold mt-2">The Statement Piece</h3>
                  <p className="opacity-0 group-hover:opacity-100 transition-opacity">This season's must-have item</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden group cursor-pointer relative">
                  <img 
                    src={`https://picsum.photos/600/400?random=${51+i}`} 
                    alt="Editor's pick"
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                    <h3 className="font-semibold">Editor's Choice {i+1}</h3>
                    <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">Discover now</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES - Modern Grid */}
      <section className="py-10 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">Shop By Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated collections for every style and occasion
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoriesWithImage.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleNavigateToListingPage(cat, "category")}
              className="group relative overflow-hidden rounded-xl cursor-pointer h-96"
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 transition-all duration-500 group-hover:bg-black/30" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transition-all duration-500 group-hover:pb-8">
                <h3 className="text-2xl font-bold mb-2">{cat.label}</h3>
                <div className="h-px w-8 bg-white mb-4 transition-all duration-500 group-hover:w-16" />
                <p className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Explore collection
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      


      {/* PROMO BANNER */}
      <section className="px-6 py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden shadow-lg relative">
          <img src="https://static.vecteezy.com/system/resources/previews/020/903/143/non_2x/shoe-sale-banner-vector.jpg" alt="Season Sale" className="w-full h-[450px] object-cover" />
          <div className="absolute inset-0 flex items-center justify-center">
            
          </div>
        </div>
      </section>

      {/* BRANDS SECTION */}
      <section className="py-20 px-6 bg-gradient-to-br from-orange-50 via-white to-pink-50 relative overflow-hidden">
  <div className="max-w-7xl mx-auto relative z-10">
    {/* Heading */}
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
        Featured <span className="text-orange-500 relative">
          Brands
          <span className="absolute -bottom-2 left-0 w-full h-2 bg-orange-200 rounded-full -z-10"></span>
        </span>
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto text-lg">
        Shop from your favorite brands and discover new ones
      </p>
    </div>

    {/* Brand grid */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">
      {brandsWithImage.map((brand) => (
        <div
          key={brand.id}
          onClick={() => handleNavigateToListingPage(brand, "brand")}
          className="flex flex-col items-center group cursor-pointer p-6 rounded-2xl bg-white shadow-md hover:shadow-xl hover:-translate-y-2 hover:bg-orange-50/60 transition-all duration-300"
        >
          {/* Logo with glow ring */}
          <div className="w-32 h-32 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-400 via-pink-400 to-yellow-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
            <div className="relative w-full h-full rounded-full border-2 border-gray-200 bg-white p-4 flex items-center justify-center">
              <img
                src={brand.image}
                alt={brand.label}
                className="w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>

          {/* Label */}
          <span className="mt-6 text-lg font-semibold text-gray-700 group-hover:text-orange-600 transition-colors duration-300">
            {brand.label}
          </span>
        </div>
      ))}
    </div>
  </div>

  {/* Decorative floating blobs */}
  <div className="absolute top-0 left-0 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
  <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
</section>


      {/* FEATURED PRODUCTS */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular items this season
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {productList?.slice(0, 8).map((p) => (
              <ShoppingProductTile
                key={p.id}
                product={p}
                handleAddtoCart={handleAddToCart}
                handleGetProductDetails={handleGetProductDetails}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              className="px-10 py-5 text-lg rounded-md"
              onClick={() => navigate("/shop/listing")}
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="py-20 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Stay Updated</h2>
          <p className="text-gray-300 mb-10 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive offers, new arrivals, and styling tips
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-4 py-3 rounded-md text-black"
            />
            <Button className="bg-white text-black hover:bg-gray-200 px-6">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
    </div>
  );
}

export default ShoppingHome;