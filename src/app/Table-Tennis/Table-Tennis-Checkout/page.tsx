import { Suspense } from "react";
import TableTennisCheckoutClient from "./TableTennisCheckout"; // Your client-only component

export default function BadmintonCheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TableTennisCheckoutClient />
    </Suspense>
  );
}
