import {
  Box,
  Heading,
  Text,
  Grid,
  GridItem,
  Badge,
  Image,
  Flex,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { useLazyGetcarListingQuery } from "@/app/api/carListingApi";
import { useParams } from "react-router-dom";
import styles from "./ViewCar.module.css";
import { useEffect, useState } from "react";

const ViewCar = () => {
  const { id: carId } = useParams();
  const [fetchCar, { data: car, isFetching }] = useLazyGetcarListingQuery();
  const [selectedImage, setSelectedImage] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (carId) fetchCar(carId);
  }, [carId]);

  useEffect(() => {
    console.log("ViewCar:", car?.listing?.car?.coverImage);
    if (car?.listing?.car?.coverImage)
      setSelectedImage(car?.listing?.car?.coverImage?.url);
  }, [car]);

  useEffect(() => {
    if (!car?.listing?.car?.images) return;
    const imgs = [car?.listing?.car?.coverImage, ...car?.listing?.car?.images];
    setImages(imgs);
  }, [car]);

  return (
    <Box p="30px" borderRadius="16px" bg="whiteAlpha.100" shadow="md">
      {isFetching ? (
        <>
          {/* Title Skeleton */}
          <Skeleton height="32px" mb="10px" borderRadius="8px" />

          {/* Description Skeleton */}
          <SkeletonText noOfLines={2} spacing="4" mb="20px" />
        </>
      ) : (
        <>
          {/* Title & Description */}
          <Heading fontSize="28px" fontWeight="700" mb="10px">
            {car?.listing?.title}
          </Heading>
          <Text fontSize="16px" color="gray.300" mb="20px">
            {car?.listing?.description}
          </Text>
        </>
      )}

      <Box mb="20px">
        {/* Big Image with Skeleton */}
        {isFetching ? (
          <Skeleton h="400px" w="100%" borderRadius="12px" mb="12px" />
        ) : (
          selectedImage && (
            <Image
              src={`${selectedImage}?v=${Date.now()}`}
              alt={car?.listing?.title}
              borderRadius="12px"
              objectFit="contain"
              w="100%"
              h="400px"
              className={styles.bigImage}
            />
          )
        )}

        {/* Thumbnails with Skeletons */}
        <Flex
          justifyContent="flex-start"
          alignItems="center"
          gap="10px"
          className={styles.thumbnailGrid}
        >
          {isFetching
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} borderRadius="8px" boxSize="80px" />
              ))
            : images?.map((img, idx) => (
                <Image
                  src={`${img.url}?v=${Date.now()}`}
                  alt={`${car?.listing?.title}-${idx}`}
                  onClick={() => setSelectedImage(img.url)}
                  cursor="pointer"
                  borderRadius="8px"
                  boxSize="80px"
                  objectFit="contain"
                  border={
                    selectedImage === img.url
                      ? "2px solid"
                      : "2px solid transparent"
                  }
                  borderColor={
                    selectedImage === img.url ? "blue.400" : "transparent"
                  }
                  shadow={selectedImage === img.url ? "md" : "sm"}
                  transition="all 0.2s ease-in-out"
                  _hover={{ transform: "scale(1.05)" }}
                />
              ))}
        </Flex>
      </Box>

      {/* Rent & Insurance */}
      <Grid templateColumns="repeat(3, 1fr)" gap={6} mb="20px">
        <GridItem>
          <Text fontWeight="600">Rent per Day</Text>
          {!isFetching ? (
            <Text>{car?.listing?.rentPerDay} AED</Text>
          ) : (
            <SkeletonText noOfLines={1} />
          )}
        </GridItem>
        <GridItem>
          <Text fontWeight="600">Rent per Week</Text>
          {!isFetching ? (
            <Text>{car?.listing?.rentPerWeek} AED</Text>
          ) : (
            <SkeletonText noOfLines={1} />
          )}
        </GridItem>
        <GridItem>
          <Text fontWeight="600">Rent per Month</Text>
          {!isFetching ? (
            <Text>{car?.listing?.rentPerMonth} AED</Text>
          ) : (
            <SkeletonText noOfLines={1} />
          )}
        </GridItem>
        <GridItem>
          <Text fontWeight="600">Extra Mileage Rate</Text>
          {!isFetching ? (
            <Text>{car?.listing?.extraMileageRate} AED/km</Text>
          ) : (
            <SkeletonText noOfLines={1} />
          )}
        </GridItem>
        <GridItem>
          <Text fontWeight="600">Delivery Charges</Text>
          {!isFetching ? (
            <Text>{car?.listing?.deliveryCharges} AED</Text>
          ) : (
            <SkeletonText noOfLines={1} />
          )}
        </GridItem>
        <GridItem>
          <Text fontWeight="600">Toll Charges</Text>
          {!isFetching ? (
            <Text>{car?.listing?.tollCharges} AED</Text>
          ) : (
            <SkeletonText noOfLines={1} />
          )}
        </GridItem>
        <GridItem>
          <Text fontWeight="600">Security Deposit</Text>
          {!isFetching ? (
            <Text>{car?.listing?.securityDeposit} AED</Text>
          ) : (
            <SkeletonText noOfLines={1} />
          )}
        </GridItem>
      </Grid>

      <hr className="text-gray-200 mb-4" />

      <Grid templateColumns="repeat(2, 1fr)" gap={6} mb="20px">
        <GridItem>
          <Text fontWeight="600">Car Insurance</Text>
          {!isFetching ? (
            <Badge
              colorPalette={
                car?.listing?.car?.carInsurance === "yes" ? "green" : "red"
              }
            >
              {car?.listing?.car.carInsurance}
            </Badge>
          ) : (
            <SkeletonText noOfLines={1} />
          )}
        </GridItem>
        <GridItem>
          <Text fontWeight="600">Warranty</Text>
          {!isFetching ? (
            <Badge
              colorPalette={
                car?.listing?.car.warranty === "yes" ? "green" : "red"
              }
            >
              {car?.listing?.car.warranty}
            </Badge>
          ) : (
            <SkeletonText noOfLines={1} />
          )}
        </GridItem>
        <GridItem>
          <Text fontWeight="600">Pickup Available</Text>
          {!isFetching ? (
            <Badge
              colorPalette={car?.listing?.pickupAvailable ? "green" : "red"}
            >
              {car?.listing?.pickupAvailable ? "Yes" : "No"}
            </Badge>
          ) : (
            <SkeletonText noOfLines={1} />
          )}
        </GridItem>

        <GridItem>
          <Text fontWeight="600">Deposit Required</Text>
          {!isFetching ? (
            <Badge
              colorPalette={car?.listing?.depositRequired ? "green" : "red"}
            >
              {car?.listing?.depositRequired ? "Yes" : "No"}
            </Badge>
          ) : (
            <SkeletonText noOfLines={1} />
          )}
        </GridItem>
      </Grid>

      <hr className="text-gray-200 mb-4" />

      {/* Car Specs */}
      <Heading fontSize="20px" fontWeight="600" mb="15px">
        Specifications
      </Heading>
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <Spec
          label="Mileage"
          value={`${car?.listing?.car.mileage} km`}
          isFetching={isFetching}
        />
        <Spec
          label="Daily Mileage"
          value={`${car?.listing?.car?.dailyMileage} km`}
          isFetching={isFetching}
        />
        <Spec
          label="Weekly Mileage"
          value={`${car?.listing?.car?.weeklyMileage} km`}
          isFetching={isFetching}
        />
        <Spec
          label="Monthly Mileage"
          value={`${car?.listing?.car?.monthlyMileage} km`}
          isFetching={isFetching}
        />
        <Spec
          label="Location"
          value={car?.listing?.location}
          isFetching={isFetching}
        />
        <Spec
          label="Brand"
          value={car?.listing?.car.carBrand?.name}
          isFetching={isFetching}
        />
        <Spec
          label="Model"
          value={car?.listing?.car?.carBrand?.carModel?.name}
          isFetching={isFetching}
        />
        <Spec
          label="Trim"
          value={car?.listing?.car?.carBrand?.carModel?.details?.carTrim}
          isFetching={isFetching}
        />
        <Spec
          label="Year"
          value={car?.listing?.car?.carBrand?.carModel?.details?.modelYear}
          isFetching={isFetching}
        />
        <Spec
          label="Category"
          value={car?.listing?.car?.category}
          isFetching={isFetching}
        />
        <Spec
          label="Regional Specs"
          value={car?.listing?.car?.regionalSpecs}
          isFetching={isFetching}
        />
        <Spec
          label="Horse Power"
          value={car?.listing?.car?.carBrand?.carModel?.details?.horsePower}
          isFetching={isFetching}
        />
        <Spec
          label="Seating Capacity"
          value={
            car?.listing?.car?.carBrand?.carModel?.details?.seatingCapacity
          }
          isFetching={isFetching}
        />
        <Spec
          label="Interior Color"
          value={car?.listing?.car?.carBrand?.carModel?.details?.interiorColor}
          isFetching={isFetching}
        />
        <Spec
          label="Exterior Color"
          value={car?.listing?.car?.carBrand?.carModel?.details?.exteriorColor}
          isFetching={isFetching}
        />
        <Spec
          label="Doors"
          value={car?.listing?.car?.carBrand?.carModel?.details?.doors}
          isFetching={isFetching}
        />
        <Spec
          label="Transmission"
          value={car?.listing?.car?.carBrand?.carModel?.details?.transmission}
          isFetching={isFetching}
        />
        <Spec
          label="Body Type"
          value={car?.listing?.car?.carBrand?.carModel?.details?.bodyType}
          isFetching={isFetching}
        />
        <Spec
          label="Fuel Type"
          value={car?.listing?.car?.carBrand?.carModel?.details?.fuelType}
          isFetching={isFetching}
        />
        <Spec
          label="Air Bags"
          value={car?.listing?.car?.airBags}
          isFetching={isFetching}
        />
        <Spec
          label="Fuel Tank Capacity"
          value={`${car?.listing?.car?.tankCapacity} L`}
          isFetching={isFetching}
        />
      </Grid>

      <hr className="text-gray-200 my-4" />

      {/* Features */}
      <Heading fontSize="20px" fontWeight="600" mt="20px" mb="10px">
        Technical Features
      </Heading>
      <Box className={styles.featureList}>
        {car?.listing?.car?.carBrand?.carModel?.details?.techFeatures?.length >
        0
          ? car?.listing?.car?.carBrand?.carModel?.details?.techFeatures.map(
              (f) => (
                <Badge key={f._id} colorScheme="blue" mr="5px" mb="5px">
                  {f.name}
                </Badge>
              )
            )
          : "No technical features"}
      </Box>

      <hr className="text-gray-200 mb-4" />

      <Heading fontSize="20px" fontWeight="600" mt="20px" mb="10px">
        Other Features
      </Heading>
      <Box className={styles.featureList}>
        {car?.listing?.car?.carBrand?.carModel?.details?.otherFeatures?.length >
        0
          ? car?.listing?.car?.carBrand?.carModel?.details?.otherFeatures.map(
              (f) => (
                <Badge key={f._id} colorScheme="purple" mr="5px" mb="5px">
                  {f.name}
                </Badge>
              )
            )
          : "No other features"}
      </Box>
    </Box>
  );
};

const Spec = ({ label, value, isFetching }) => (
  <Box>
    <Text fontWeight="600">{label}</Text>
    {!isFetching ? <Text>{value || "-"}</Text> : <SkeletonText noOfLines={1} />}
  </Box>
);

export default ViewCar;
