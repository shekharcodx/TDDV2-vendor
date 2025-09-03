import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Button, Text } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetVendorListingsQuery } from "../../../app/api/carListingApi";
import styles from "./mylist.module.css";

function AllListings() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedActive, setSelectedActive] = useState("");

  const { data, isLoading, isError, refetch } = useGetVendorListingsQuery({
    page,
    status: selectedStatus || undefined,
    isActive: selectedActive || undefined,
  });

  useEffect(() => {
    refetch();
  }, [page, selectedStatus, selectedActive]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong.</p>;

  const listings = data?.listings?.docs || [];
  const totalDocs = data?.listings?.totalDocs || 0;
  const totalPages = data?.listings?.totalPages || 1;
  const hasPrevPage = data?.listings?.hasPrevPage;
  const hasNextPage = data?.listings?.hasNextPage;

  return (
    <div className={styles.wrapper}>
      {/* Filters */}
      <Flex mb="20px" gap={4} wrap="wrap" align="center">
  {/* Status Filter */}
  <div className={styles.selectWrapper}>
    <label htmlFor="status">Status</label>
    <select
      id="status"
      className={styles.select}
      value={selectedStatus}
      onChange={(e) => setSelectedStatus(e.target.value)}
    >
      <option value="">All Status</option>
      <option value="1">Pending</option>
      <option value="2">Approved</option>
      <option value="3">Hold</option>
    </select>
  </div>

  {/* Active Filter */}
  <div className={styles.selectWrapper}>
    <label htmlFor="active">Active Status</label>
    <select
      id="active"
      className={styles.select}
      value={selectedActive}
      onChange={(e) => setSelectedActive(e.target.value)}
    >
      <option value="">All Active</option>
      <option value="true">Active</option>
      <option value="false">Inactive</option>
    </select>
  </div>

  {/* Reset Filters */}
  <Button
    size="sm"
    className={styles.button}
    mt={{ base: 2, md: 0 }}
    onClick={() => {
      setSelectedStatus("");
      setSelectedActive("");
    }}
  >
    Reset Filters
  </Button>
</Flex>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Rent / Day</th>
              <th>Rent / Week</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing._id}>
                <td>
                  <img
                    src={listing?.car?.images?.[0]?.url}
                    alt={listing?.car?.carBrand?.name}
                    className={styles.image}
                  />
                </td>
                <td>{listing?.car?.carBrand?.name}</td>
                <td>{listing?.car?.carBrand?.carModel?.name}</td>
                <td>{`AED ${listing?.rentPerDay}`}</td>
                <td>{`AED ${listing?.rentPerWeek}`}</td>
                <td>
                  <span
                    className={`${styles.status} ${
                      listing?.status === 2
                        ? styles.approved
                        : listing?.status === 1
                        ? styles.pending
                        : styles.hold
                    }`}
                  >
                    {listing?.status === 2
                      ? "Approved"
                      : listing?.status === 1
                      ? "Pending"
                      : "Hold"}
                  </span>
                </td>
                <td>
                  <button
                    className={styles.editBtn}
                    onClick={() =>
                      navigate("/edit", { state: { car: listing } })
                    }
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ marginTop: "20px", marginBottom: "20px", padding: "0 20px" }}>
          <Flex justify="space-between" align="center" gap={4}>
            <Text fontSize="sm">
              Showing {data?.listings?.pagingCounter}–
              {Math.min(
                data?.listings?.pagingCounter + listings.length - 1,
                totalDocs
              )}{" "}
              of {totalDocs}
            </Text>

            <Flex gap={2} align="center">
              <Button
                size="sm"
                onClick={() => setPage((prev) => prev - 1)}
                isDisabled={!hasPrevPage}
                bg="var(--gradient-background)"
                color="white"
                _hover={{ bg: "var(--gradient-background)", opacity: 0.9 }}
                opacity={!hasPrevPage ? 0.5 : 1}
                borderRadius="md"
                px={3}
              >
                <ChevronLeft size={14} style={{ marginRight: "4px" }} />
                Prev
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  size="sm"
                  onClick={() => setPage(p)}
                  bg="var(--gradient-background)"
                  color="white"
                  _hover={{ bg: "var(--gradient-background)", opacity: 0.9 }}
                  opacity={page === p ? 1 : 0.7}
                  borderRadius="md"
                  px={3}
                >
                  {p}
                </Button>
              ))}

              <Button
                size="sm"
                onClick={() => setPage((prev) => prev + 1)}
                isDisabled={!hasNextPage}
                bg="var(--gradient-background)"
                color="white"
                _hover={{ bg: "var(--gradient-background)", opacity: 0.9 }}
                opacity={!hasNextPage ? 0.5 : 1}
                borderRadius="md"
                px={3}
              >
                Next
                <ChevronRight size={14} style={{ marginLeft: "4px" }} />
              </Button>
            </Flex>
          </Flex>
        </div>
      </div>
    </div>
  );
}

export default AllListings;
