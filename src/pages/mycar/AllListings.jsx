import DataTable from "@/components/DataTable";
import { LISTING_STATUS_NUM } from "@/config/constants";
import { Box, Button, Heading, Menu, Portal, Skeleton } from "@chakra-ui/react";
import { MenuIcon } from "lucide-react";
import { useGetVendorListingsQuery } from "@/app/api/carListingApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./Listing.module.css";
import FilterSelect from "@/components/FilterSelect";
import { listingStatuses, isActiveStatus, getKeyNames } from "@/utils/helper";
import FilterResetBtn from "@/components/FilterResetBtn";

const AllListings = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedActiveStatus, setSelectedActiveStatus] = useState([]);
  const { data: listings, isFetching } = useGetVendorListingsQuery({
    page,
    status: selectedStatus?.[0],
    isActive: selectedActiveStatus?.[0],
  });
  const columns = [
    {
      key: "image",
      label: "Image",
      render: (listing) => (
        <img
          src={listing?.car?.images?.[0]?.url || placeholderImg}
          alt={
            listing?.car?.carBrand?.name + " " + listing?.car?.carModel?.name
          }
          className={`${styles.avatar} mx-auto`}
        />
      ),
    },
    {
      key: "title",
      label: "Title",
    },
    {
      key: "brand",
      label: "Brand",
      render: (listing) => <span>{listing?.car?.carBrand?.name}</span>,
    },
    {
      key: "model",
      label: "Model",
      render: (listing) => (
        <span>{listing?.car?.carBrand?.carModel?.name}</span>
      ),
    },
    {
      key: "rentPerDay",
      label: "Rent/Day",
    },
    { key: "rentPerWeek", label: "Rent/Week" },
    { key: "rentPerMonth", label: "Rent/Month" },
    {
      key: "isFeatured",
      label: "Featured",
      render: (listing) => (
        <span
          className={`${styles.status} ${
            listing.isFeatured
              ? styles.statusGreen
              : !listing.isFeatured
              ? styles.statusYellow
              : styles.statusOrange
          }`}
        >
          {listing.isFeatured ? "True" : "False"}
        </span>
      ),
    },
    {
      key: "isPremium",
      label: "Premium",
      render: (listing) => (
        <span
          className={`${styles.status} ${
            listing.isPremium
              ? styles.statusGreen
              : !listing.isPremium
              ? styles.statusYellow
              : styles.statusOrange
          }`}
        >
          {listing.isPremium ? "True" : "False"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (listing) => (
        <span
          className={`${styles.status} ${
            listing.status === 2
              ? styles.statusGreen
              : listing.status === 1
              ? styles.statusYellow
              : styles.statusOrange
          }`}
        >
          {LISTING_STATUS_NUM[listing.status]}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Active",
      render: (listing) =>
        listing.isActive ? (
          <span className={styles.activeBadge}>Active</span>
        ) : (
          <span className={styles.inactiveBadge}>Deactivated</span>
        ),
    },
    {
      key: "action",
      label: "Action",
      render: (listing) => (
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
                {/* <Menu.Item
                  value="view"
                  cursor="pointer"
                  onClick={() => navigate(`/car-listings/view/${listing._id}`)}
                >
                  View
                </Menu.Item> */}
                <Menu.Item
                  value="edit"
                  cursor="pointer"
                  onClick={() => navigate("/edit", { state: { car: listing } })}
                >
                  Edit
                </Menu.Item>
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
          Car Listings
        </Heading>
        <Box
          display={{ base: "block", md: "flex" }}
          justifyContent={{ base: "center", md: "start" }}
          alignItems="end"
          gap={{ md: "20px" }}
          my="20px"
        >
          <FilterSelect
            title="Listing Status"
            placeholder="Select listing status"
            collection={listingStatuses}
            value={selectedStatus}
            setValue={setSelectedStatus}
            helper={getKeyNames}
          />

          <FilterSelect
            title="Listing Active Status"
            placeholder="Select listing active status"
            collection={isActiveStatus}
            value={selectedActiveStatus}
            setValue={setSelectedActiveStatus}
          />

          <FilterResetBtn
            setSelectOne={setSelectedStatus}
            setSelectTwo={setSelectedActiveStatus}
          />
        </Box>
      </Box>
      <DataTable
        columns={columns}
        data={listings?.listings?.docs || []}
        isFetching={isFetching}
        pagination={true}
        paginationData={listings?.listings}
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

export default AllListings;
