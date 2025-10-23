import { baseApi } from "./baseApi";

const bookingApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getBookings: builder.query({
      query: () => ({
        url: "/vendor-bookings",
        method: "GET",
      }),
      providesTags: ["bookings"],
    }),
    updateBookingStatus: builder.mutation({
      query: ({ bookingId, bookingStatus }) => ({
        url: `/vendor-booking/status/${bookingId}`,
        method: "PATCH",
        body: { bookingStatus },
      }),
      invalidatesTags: ["bookings"],
    }),
  }),
});

export const { useGetBookingsQuery, useUpdateBookingStatusMutation } =
  bookingApi;
