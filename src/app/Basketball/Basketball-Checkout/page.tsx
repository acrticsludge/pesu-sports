import { Suspense } from "react";
import BasketballCheckoutClient from "./BasketballCheckout"; // Your client-only component

export default function BadmintonCheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BasketballCheckoutClient />
    </Suspense>
  );
}
