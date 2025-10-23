import DataTable from "@/components/DataTable";
import {
  useGetBookingsQuery,
  useUpdateBookingStatusMutation,
} from "@/app/api/bookingApi";
import { Box, Button, Heading, Menu, Portal, Skeleton } from "@chakra-ui/react";
import { MenuIcon } from "lucide-react";
import { toaster } from "@/components/ui/toaster";
import styles from "./Bookings.module.css";
import { useState } from "react";
import { LuChevronRight } from "react-icons/lu";

const Booking = () => {
  const [page, setPage] = useState(1);
  const { data: bookings, isFetching } = useGetBookingsQuery();
  const [updateStatus] = useUpdateBookingStatusMutation();

  const handleAccountStatusChange = (bookingId, bookingStatus) => {
    if (!confirm("Do you want to continue")) return;

    toaster.promise(updateStatus({ bookingId, bookingStatus }).unwrap(), {
      loading: { title: "Changing status...", description: "" },
      success: (res) => {
        return {
          title: res.message || "Status updated successfully",
          description: "",
        };
      },
      error: (err) => {
        console.log("index:Account change err", err);
        return {
          title: "Error changing status",
          description: "",
        };
      },
    });
  };

  const columns = [
    {
      key: "coverImage",
      label: "Image",
      render: (booking) => {
        console.log("index:booking", booking.car.images[0].url);
        return (
          <img
            src={
              booking?.car?.coverImage?.url
                ? `${booking.car.coverImage.url}?v=${Date.now()}`
                : `${booking?.car?.images?.[0]?.url}?v=${Date.now()}`
            }
            alt={booking?.car?.carBrand?.name + " " + booking?.car?.carModel}
            className={`${styles.avatar} mx-auto !object-contain`}
          />
        );
      },
    },
    {
      key: "customer",
      label: "Customer",
      render: (booking) => <span>{booking?.customer?.name}</span>,
    },
    {
      key: "pickupDate",
      label: "Pickup Date",
      render: (booking) => (
        <span style={{ whiteSpace: "nowrap" }}>
          {new Date(booking?.pickupDate)?.toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </span>
      ),
    },
    {
      key: "dropoffDate",
      label: "Dropoff Date",
      render: (booking) => (
        <span style={{ whiteSpace: "nowrap" }}>
          {new Date(booking?.dropoffDate)?.toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </span>
      ),
    },
    {
      key: "deliveryRequired",
      label: "Delivery Required",
      render: (booking) => (
        <span>{booking?.deliveryRequired ? "Yes" : "No"}</span>
      ),
    },
    {
      key: "priceType",
      label: "Price Type",
    },
    {
      key: "dropoffAddress",
      label: "Dropoff Address",
      render: (booking) => <span>{booking?.dropoffAddress || "NA"}</span>,
    },
    {
      key: "payment",
      label: "Payment",
      render: (booking) => (
        <span
          className={`${styles.status} ${
            booking?.payment == 2 ? styles.statusGreen : styles.statusYellow
          }`}
        >
          {booking?.payment == 1 ? "Pending" : "Complete"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (booking) => (
        <span
          className={`${styles.status} ${
            booking?.status == 1
              ? styles.statusYellow
              : booking?.status == 2
                ? styles.statusGreen
                : styles.statusYellow
          }`}
        >
          {booking?.status == 1
            ? "Pending"
            : booking?.status == 2
              ? "Confirmed"
              : booking?.status == 3
                ? "Cancelled"
                : "Expired"}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Active",
      render: (booking) =>
        booking.isActive ? (
          <span className={styles.activeBadge}>Active</span>
        ) : (
          <span className={styles.inactiveBadge}>Deactivated</span>
        ),
    },
    {
      key: "action",
      label: "Action",
      render: (booking) => (
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button
              mx="auto"
              display="block"
              variant="outline"
              color="#000"
              outline="none"
              border="none"
              // bgGradient="linear-gradient( 90deg, rgba(91, 120, 124, 1) 0%, rgba(137, 180, 188, 1) 35% );"
              size="sm"
            >
              <MenuIcon color="rgba(91, 120, 124, 1)" />
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Root
                  positioning={{ placement: "right-start", gutter: 2 }}
                >
                  <Menu.TriggerItem cursor="pointer">
                    Change Status <LuChevronRight />
                  </Menu.TriggerItem>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content>
                        {booking.status !== 2 && booking.status !== 3 && (
                          <Menu.Item
                            value="approved"
                            cursor="pointer"
                            onClick={() =>
                              handleAccountStatusChange(booking._id, 2)
                            }
                          >
                            Confirmed
                          </Menu.Item>
                        )}
                        {booking.status !== 3 && (
                          <Menu.Item
                            value="onHold"
                            cursor="pointer"
                            onClick={() =>
                              handleAccountStatusChange(booking._id, 3)
                            }
                          >
                            Cancelled
                          </Menu.Item>
                        )}
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      ),
    },
  ];
  return (
    <>
      <Box mb="10px" borderBottom="1px solid #fff5">
        <Heading fontSize="24px" fontWeight="600" mb="30px">
          Bookings
        </Heading>
      </Box>
      <DataTable
        columns={columns}
        data={bookings?.data?.docs || []}
        isFetching={isFetching}
        pagination={true}
        paginationData={bookings?.data}
        page={page}
        setPage={setPage}
        skeleton={<SkeletonRow />}
        getRowClass={(_, i) =>
          i % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
        }
      />
    </>
  );
};

const SkeletonRow = () => {
  return (
    <tr className={`${styles.tableRowEven} py-[10px]`}>
      <td className={`${styles.tableCell}`} colSpan={12}>
        <Skeleton height="18px" width="100%" variant="shine" />
      </td>
    </tr>
  );
};

export default Booking;
