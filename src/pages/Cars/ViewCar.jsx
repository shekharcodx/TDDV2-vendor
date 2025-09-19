import {
  Box,
  Heading,
  Text,
  Grid,
  GridItem,
  Badge,
  Image,
  Flex,
} from "@chakra-ui/react";
import { useLazyGetcarListingQuery } from "@/app/api/carListingApi";
import { useParams } from "react-router-dom";
import styles from "./ViewCar.module.css";
import { useEffect, useState } from "react";

const ViewCar = () => {
  const { id: carId } = useParams();
  const [fetchCar, { data: car, isFetching }] = useLazyGetcarListingQuery();
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (carId) fetchCar(carId);
  }, [carId]);

  useEffect(() => {
    if (car?.listing?.car?.images.length > 0)
      setSelectedImage(car?.listing?.car?.images[0]?.url);
  }, [car]);

  return (
    <Box p="30px" borderRadius="16px" bg="whiteAlpha.100" shadow="md">
      {/* Title & Description */}
      <Heading fontSize="28px" fontWeight="700" mb="10px">
        {car?.listing?.title}
      </Heading>
      <Text fontSize="16px" color="gray.300" mb="20px">
        {car?.listing?.description}
      </Text>

      {car?.listing?.car?.images.length > 0 && (
        <Box mb="20px">
          {/* Big Image */}
          <Image
            src={selectedImage}
            alt={car?.listing?.title}
            borderRadius="12px"
            objectFit="contain"
            w="100%"
            h="400px"
            mb="12px"
            className={styles.bigImage}
          />

          {/* Thumbnails */}
          <Flex
            justifyContent="flex-start"
            alignItems="center"
            className={styles.thumbnailGrid}
          >
            {car?.listing?.car?.images.map((img, idx) => (
              <Image
                key={idx}
                src={img.url}
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
      )}

      {/* Rent & Insurance */}
      <Grid templateColumns="repeat(3, 1fr)" gap={6} mb="20px">
        <GridItem>
          <Text fontWeight="600">Rent per Day</Text>
          <Text>{car?.listing?.rentPerDay} AED</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="600">Rent per Week</Text>
          <Text>{car?.listing?.rentPerWeek} AED</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="600">Rent per Month</Text>
          <Text>{car?.listing?.rentPerMonth} AED</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="600">Extra Mileage Rate</Text>
          <Text>{car?.listing?.extraMileageRate} AED/km</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="600">Delivery Charges</Text>
          <Text>{car?.listing?.deliveryCharges} AED</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="600">Toll Charges</Text>
          <Text>{car?.listing?.tollCharges} AED</Text>
        </GridItem>
        <GridItem>
          <Text fontWeight="600">Security Deposit</Text>
          <Text>{car?.listing?.securityDeposit} AED</Text>
        </GridItem>
      </Grid>

      <hr className="text-gray-200 mb-4" />

      <Grid templateColumns="repeat(2, 1fr)" gap={6} mb="20px">
        <GridItem>
          <Text fontWeight="600">Car Insurance</Text>
          <Badge
            colorPalette={
              car?.listing?.car?.carInsurance === "yes" ? "green" : "red"
            }
          >
            {car?.listing?.car.carInsurance}
          </Badge>
        </GridItem>
        <GridItem>
          <Text fontWeight="600">Warranty</Text>
          <Badge
            colorPalette={
              car?.listing?.car.warranty === "yes" ? "green" : "red"
            }
          >
            {car?.listing?.car.warranty}
          </Badge>
        </GridItem>
        <GridItem>
          <Text fontWeight="600">Pickup Available</Text>
          <Badge colorPalette={car?.listing?.pickupAvailable ? "green" : "red"}>
            {car?.listing?.pickupAvailable ? "Yes" : "No"}
          </Badge>
        </GridItem>

        <GridItem>
          <Text fontWeight="600">Deposit Required</Text>
          <Badge colorPalette={car?.listing?.depositRequired ? "green" : "red"}>
            {car?.listing?.depositRequired ? "Yes" : "No"}
          </Badge>
        </GridItem>
      </Grid>

      <hr className="text-gray-200 mb-4" />

      {/* Car Specs */}
      <Heading fontSize="20px" fontWeight="600" mb="15px">
        Specifications
      </Heading>
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <Spec label="Mileage" value={`${car?.listing?.car.mileage} km`} />
        <Spec
          label="Daily Mileage"
          value={`${car?.listing?.car?.dailyMileage} km`}
        />
        <Spec
          label="Weekly Mileage"
          value={`${car?.listing?.car?.weeklyMileage} km`}
        />
        <Spec
          label="Monthly Mileage"
          value={`${car?.listing?.car?.monthlyMileage} km`}
        />
        <Spec label="Location" value={car?.listing?.location} />
        <Spec label="Brand" value={car?.listing?.car.carBrand?.name} />
        <Spec
          label="Model"
          value={car?.listing?.car?.carBrand?.carModel?.name}
        />
        <Spec
          label="Trim"
          value={car?.listing?.car?.carBrand?.carModel?.details?.carTrim}
        />
        <Spec
          label="Year"
          value={car?.listing?.car?.carBrand?.carModel?.details?.modelYear}
        />
        <Spec label="Category" value={car?.listing?.car?.category} />
        <Spec label="Regional Specs" value={car?.listing?.car?.regionalSpecs} />
        <Spec
          label="Horse Power"
          value={car?.listing?.car?.carBrand?.carModel?.details?.horsePower}
        />
        <Spec
          label="Seating Capacity"
          value={
            car?.listing?.car?.carBrand?.carModel?.details?.seatingCapacity
          }
        />
        <Spec
          label="Interior Color"
          value={car?.listing?.car?.carBrand?.carModel?.details?.interiorColor}
        />
        <Spec
          label="Exterior Color"
          value={car?.listing?.car?.carBrand?.carModel?.details?.exteriorColor}
        />
        <Spec
          label="Doors"
          value={car?.listing?.car?.carBrand?.carModel?.details?.doors}
        />
        <Spec
          label="Transmission"
          value={car?.listing?.car?.carBrand?.carModel?.details?.transmission}
        />
        <Spec
          label="Body Type"
          value={car?.listing?.car?.carBrand?.carModel?.details?.bodyType}
        />
        <Spec
          label="Fuel Type"
          value={car?.listing?.car?.carBrand?.carModel?.details?.fuelType}
        />
        <Spec label="Air Bags" value={car?.listing?.car?.airBags} />
        <Spec
          label="Fuel Tank Capacity"
          value={`${car?.listing?.car?.tankCapacity} L`}
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

const Spec = ({ label, value }) => (
  <Box>
    <Text fontWeight="600">{label}</Text>
    <Text>{value || "-"}</Text>
  </Box>
);

export default ViewCar;
