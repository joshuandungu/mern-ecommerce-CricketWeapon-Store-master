import React, { useState, useEffect, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import { load_UserProfile } from "./actions/userAction";
import API from "./apiConfig";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PageLoader from "./component/layouts/loader/Loader";
import PrivateRoute from "./component/Route/PrivateRoute";
import { SpeedInsights } from '@vercel/speed-insights/react';
import "./App.css";

import Header from "./component/layouts/Header1.jsx/Header";
import PaymentOptions from "./component/Cart/PaymentOptions"; // Renamed from Payment
import StripePaymentForm from "./component/Cart/StripePaymentForm"; // New component for Stripe
import MpesaPayment from "./component/Cart/MpesaPayment";
import Home from "./component/Home/Home";
import Services from "./Terms&Condtions/Service";
import Footer from "./component/layouts/Footer/Footer";
import ProductDetails from "./component/Product/ProductDetails";
import Products from "./component/Product/Products";
import Signup from "./component/User/SignUp";
import Login from "./component/User/Login";
import Profile from "./component/User/Profile";
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgetPassword from "./component/User/ForgetPassword";
import ResetPassword from "./component/User/ResetPassword";
import Shipping from "./component/Cart/Shipping";
import Cart from "./component/Cart/Cart";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
import OrderSuccess from "./component/Cart/OrderSuccess";
import MyOrder from "./component/order/MyOrder";
import ContactForm from "./Terms&Condtions/Contact";
import AboutUsPage from "./Terms&Condtions/Aboutus";
import ReturnPolicyPage from "./Terms&Condtions/Return";
import TermsUse from "./Terms&Condtions/TermsAndUse";
import TermsAndConditions from "./Terms&Condtions/TermsCondtion";
import PrivacyPolicy from "./Terms&Condtions/Privacy";
// const LazyPayment = React.lazy(() => import("./component/Cart/Payment"));

// Modern Layout Wrapper
const PageLayout = ({ children, hideServices = false }) => (
  <>
    <Header />
    <main style={{ minHeight: "80vh" }}>{children}</main>
    {!hideServices && <Services />}
    <Footer />
  </>
);

const LazyDashboard = React.lazy(() => import("./component/Admin/Dashboard"));
const LazyProductList = React.lazy(() =>
  import("./component/Admin/ProductList")
);
const LazyOrderList = React.lazy(() => import("./component/Admin/OrderList"));
const LazyUserList = React.lazy(() => import("./component/Admin/UserList"));
const LazyUpdateProduct = React.lazy(() =>
  import("./component/Admin/UpdateProduct")
);
const LazyProcessOrder = React.lazy(() =>
  import("./component/Admin/ProcessOrder")
);
const LazyUpdateUser = React.lazy(() => import("./component/Admin/UpdateUser"));
const LazyNewProduct = React.lazy(() => import("./component/Admin/NewProduct"));
const LazyProductReviews = React.lazy(() =>
  import("./component/Admin/ProductReviews")
);
const LazyCategoryList = React.lazy(() => import("./component/Admin/CategoryList"));
const LazyNewCategory = React.lazy(() => import("./component/Admin/NewCategory"));

function App() {
  const [stripeApiKey, setStripeApiKey] = useState("");

  const dispatch = useDispatch();

  // get STRIPE_API_KEY for payment from backend for connection to stripe payment gateway
  async function getStripeApiKey() {
    try {
      const { data } = await API.get("/stripeapikey");
      if (
        data.stripeApiKey !== undefined &&
        data.stripeApiKey !== null &&
        data.stripeApiKey !== ""
      ) {
        sessionStorage.setItem(
          "stripeApiKey",
          JSON.stringify(data.stripeApiKey)
        );
      }
      setStripeApiKey(data.stripeApiKey);
    } catch (error) {
      // Handle error if the API call fails
      console.error("Error fetching Stripe API key:", error);
    }
  }

  useEffect(() => {
    const stripeApiKey = sessionStorage.getItem("stripeApiKey");
    if (stripeApiKey) {
      setStripeApiKey(stripeApiKey);
    } else {
      getStripeApiKey();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    dispatch(load_UserProfile());

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <SpeedInsights />
      <Suspense fallback={<PageLoader />}>
        <Switch>
          {/* Admin Routes */}
          <PrivateRoute isAdmin={true} exact path="/admin/dashboard" component={LazyDashboard} />
          <PrivateRoute isAdmin={true} exact path="/admin/products" component={LazyProductList} />
          <PrivateRoute isAdmin={true} exact path="/admin/product/:id" component={LazyUpdateProduct} />
          <PrivateRoute isAdmin={true} exact path="/admin/reviews" component={LazyProductReviews} />
          <PrivateRoute isAdmin={true} exact path="/admin/orders" component={LazyOrderList} />
          <PrivateRoute isAdmin={true} exact path="/admin/order/:id" component={LazyProcessOrder} />
          <PrivateRoute isAdmin={true} exact path="/admin/new/product" component={LazyNewProduct} />
          <PrivateRoute isAdmin={true} exact path="/admin/users" component={LazyUserList} />
          <PrivateRoute isAdmin={true} exact path="/admin/user/:id" component={LazyUpdateUser} />
          <PrivateRoute isAdmin={true} exact path="/admin/categories" component={LazyCategoryList} />
          <PrivateRoute isAdmin={true} exact path="/admin/new/category" component={LazyNewCategory} />

          {/* Payment Handling (Needs specific wrappers) */}
          <PrivateRoute exact path="/process/payment" component={(props) => <PageLayout hideServices><PaymentOptions {...props} stripeApiKey={stripeApiKey} /></PageLayout>} />
          {stripeApiKey && (
            <Route exact path="/process/payment/stripe">
              <Elements stripe={loadStripe(stripeApiKey)}>
                <PrivateRoute exact path="/process/payment/stripe" component={(props) => <PageLayout hideServices><StripePaymentForm {...props} /></PageLayout>} />
              </Elements>
            </Route>
          )}
          <PrivateRoute exact path="/process/payment/mpesa" component={(props) => <PageLayout hideServices><MpesaPayment {...props} /></PageLayout>} />

          {/* Public & Standard User Routes */}
          <Route exact path="/" render={() => <PageLayout><Home /></PageLayout>} />
          <Route exact path="/product/:id" render={() => <PageLayout><ProductDetails /></PageLayout>} />
          <Route exact path="/products" render={() => <PageLayout><Products /></PageLayout>} />
          <Route path="/products/:keyword" render={() => <PageLayout><Products /></PageLayout>} />
          <Route exact path="/signup" render={() => <PageLayout><Signup /></PageLayout>} />
          <Route exact path="/login" render={() => <PageLayout><Login /></PageLayout>} />
          <Route exact path="/password/forgot" render={() => <PageLayout><ForgetPassword /></PageLayout>} />
          <Route exact path="/password/reset/:token" render={() => <PageLayout><ResetPassword /></PageLayout>} />
          <Route exact path="/cart" render={() => <PageLayout><Cart /></PageLayout>} />
          <Route exact path="/policy/return" render={() => <PageLayout><ReturnPolicyPage /></PageLayout>} />
          <Route exact path="/policy/Terms" render={() => <PageLayout><TermsUse /></PageLayout>} />
          <Route exact path="/policy/privacy" render={() => <PageLayout><PrivacyPolicy /></PageLayout>} />
          <Route exact path="/terms/conditions" render={() => <PageLayout><TermsAndConditions /></PageLayout>} />
          <Route exact path="/contact" render={() => <PageLayout hideServices><ContactForm /></PageLayout>} />
          <Route exact path="/about_us" render={() => <PageLayout hideServices><AboutUsPage /></PageLayout>} />

          {/* Protected Account Routes */}
          <PrivateRoute exact path="/account" component={(props) => <PageLayout><Profile {...props} /></PageLayout>} />
          <PrivateRoute exact path="/profile/update" component={(props) => <PageLayout><UpdateProfile {...props} /></PageLayout>} />
          <PrivateRoute exact path="/password/update" component={(props) => <PageLayout><UpdatePassword {...props} /></PageLayout>} />
          <PrivateRoute exact path="/orders" component={(props) => <PageLayout><MyOrder {...props} /></PageLayout>} />
          <PrivateRoute exact path="/shipping" component={(props) => <PageLayout><Shipping {...props} /></PageLayout>} />
          <PrivateRoute exact path="/order/confirm" component={(props) => <PageLayout><ConfirmOrder {...props} /></PageLayout>} />
          <PrivateRoute exact path="/success" component={(props) => <PageLayout><OrderSuccess {...props} /></PageLayout>} />
        </Switch>
      </Suspense>
    </>
  );
}

export default App;
