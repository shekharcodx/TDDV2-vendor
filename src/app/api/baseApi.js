import { getToken } from "@/utils/localStorageMethods";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toaster } from "@/components/ui/toaster";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_SERVER_URL,
  prepareHeaders: (headers) => {
    const userToken = getToken();
    if (userToken) {
      headers.set("Authorization", `Bearer ${userToken}`);
    }
    return headers;
  },
});

const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    console.error("API Error:", result.error);
    if (result.error?.data?.code === 9028) {
      toaster.create({
        type: "error",
        title: "Account Not Approved",
        description:
          "Your account has not been approved, please contact support",
        closable: true,
        duration: 5000,
      });
    }
    if (result.error.status === 401) {
      // maybe dispatch a logout, clear token, redirect, etc.
      // api.dispatch(logoutUser());
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithErrorHandling,
  endpoints: () => ({}),
  tagTypes: [
    "User",
    "countries",
    "states",
    "cities",
    // Add all your car-related tag types here:
    "CarBrands",
    "CarModels",
    "CarTrims",
    "CarYears",
    "BodyTypes",
    "RegionalSpecs",
    "HorsePowers",
    "SeatingCapacities",
    "Colors",
    "Doors",
    "Transmissions",
    "FuelTypes",
    "TechFeatures",
    "OtherFeatures",
    "profile",
    "Categories",
    "VendorCar",
  ],
});
