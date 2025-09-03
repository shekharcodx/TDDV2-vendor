import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flex,
  Button,
  ButtonGroup,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetVendorListingsQuery } from "../../../app/api/carListingApi";
import styles from "./mylist.module.css";

function AllListings() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useGetVendorListingsQuery({ page });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong.</p>;

  const listings = data?.listings?.docs || [];
  const totalDocs = data?.listings?.totalDocs || 0;
  const totalPages = data?.listings?.totalPages || 1;

  // ✅ Utility to generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const siblingCount = 1; // how many numbers to show around current page
    const firstPage = 1;
    const lastPage = totalPages;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page > siblingCount + 2) {
        pages.push(firstPage, "...");
      } else {
        for (let i = 1; i < page; i++) pages.push(i);
      }

      for (
        let i = Math.max(page - siblingCount, 1);
        i <= Math.min(page + siblingCount, totalPages);
        i++
      ) {
        pages.push(i);
      }

      if (page < totalPages - (siblingCount + 1)) {
        pages.push("...", lastPage);
      } else {
        for (let i = page + 1; i <= lastPage; i++) pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div className={styles.wrapper}>
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
                <td>{listing?.car?.carModel?.name}</td>
                <td>{`AED ${listing?.rentPerDay}`}</td>
                <td>{`AED ${listing?.rentPerWeek}`}</td>
                <td>
                  <span
                    className={`${styles.status} ${
                      listing?.status === 1
                        ? styles.approved
                        : listing?.status === 0
                        ? styles.pending
                        : styles.hold
                    }`}
                  >
                    {listing?.status === 1
                      ? "Approved"
                      : listing?.status === 0
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

        {/* ✅ New Pagination */}
        <Flex justify="space-between" align="center" mt={4}>
          <Text fontSize="sm">
            Showing {listings.length} of {totalDocs}
          </Text>

          <ButtonGroup size="sm" variant="outline" isAttached>
            {/* Prev */}
            <IconButton
              icon={<ChevronLeft size={16} />}
              aria-label="Previous Page"
              onClick={() => setPage((prev) => prev - 1)}
              isDisabled={page === 1}
            />

            {/* Page Numbers with Ellipsis */}
            {getPageNumbers().map((p, idx) =>
              p === "..." ? (
                <Button key={`ellipsis-${idx}`} isDisabled>
                  ...
                </Button>
              ) : (
                <Button
                  key={p}
                  onClick={() => setPage(p)}
                  variant={page === p ? "solid" : "outline"}
                >
                  {p}
                </Button>
              )
            )}

            {/* Next */}
            <IconButton
              icon={<ChevronRight size={16} />}
              aria-label="Next Page"
              onClick={() => setPage((prev) => prev + 1)}
              isDisabled={page === totalPages}
            />
          </ButtonGroup>
        </Flex>
      </div>
    </div>
  );
}

export default AllListings;
