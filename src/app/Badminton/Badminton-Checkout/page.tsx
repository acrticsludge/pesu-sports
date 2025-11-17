import { Suspense } from "react";
import BadmintonCheckoutClient from "./BadmintonCheckout"; // Your client-only component

export default function BadmintonCheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BadmintonCheckoutClient />
    </Suspense>
  );
}
