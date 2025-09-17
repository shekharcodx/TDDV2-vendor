import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import styles from "./CreateCar.module.css";
import { toaster } from "@/components/ui/toaster";
import {
  useGetCarBrandsQuery,
  useLazyGetModelsQuery,
  useLazyGetCarTrimsQuery,
  useGetCarCategoriesQuery,
  useLazyGetYearsQuery,
  useGetCarRegionalSpecsQuery,
  useGetCarHorsePowersQuery,
  useGetCarSeatingCapacitiesQuery,
  useGetCarColorsQuery,
  useGetCarDoorsQuery,
  useGetTransmissionsQuery,
  useGetBodyTypesQuery,
  useGetFuelTypesQuery,
  useGetCarTechFeaturesQuery,
  useGetCarOtherFeaturesQuery,
  useUpdateCarListingMutation,
} from "@/app/api/carListingApi";
import { Box, Heading, Text } from "@chakra-ui/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const editCarSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z
    .string()
    .min(10, "Description should be at least 10 characters"),
  rentPerDay: z.coerce
    .number()
    .positive("Rent per day must be a positive number"),
  rentPerWeek: z.coerce
    .number()
    .positive("Rent per week must be a positive number"),
  rentPerMonth: z.coerce
    .number()
    .positive("Rent per month must be a positive number"),
  carInsurance: z.enum(["yes", "no"], {
    required_error: "Car insurance is required",
  }),
  warranty: z.enum(["yes", "no"], { required_error: "Warranty is required" }),
  mileage: z.coerce.number().nonnegative("Mileage must be 0 or more"),
  location: z.string().min(2, "Location is required"),
  carBrand: z.string().min(1, "Brand is required"),
  carModel: z.string().min(1, "Model is required"),
  carTrim: z.string().min(1, "Trim is required"),
  carCategory: z.string().min(1, "Category is required"),
  modelYear: z.string().min(1, "Year is required"),
  regionalSpecs: z.string().min(1, "Regional specs is required"),
  horsePower: z.string().min(1, "Horse power is required"),
  seatingCapacity: z.string().min(1, "Seating capacity is required"),
  interiorColor: z.string().min(1, "Interior color is required"),
  exteriorColor: z.string().min(1, "Exterior color is required"),
  carDoors: z.string().min(1, "Doors is required"),
  transmission: z.string().min(1, "Transmission is required"),
  bodyType: z.string().min(1, "Body type is required"),
  fuelType: z.string().min(1, "Fuel type is required"),
  techFeatures: z.array(z.string()).optional(),
  otherFeatures: z.array(z.string()).optional(),
  images: z
    .any()
    .optional()
    .refine(
      (files) => !files || files instanceof FileList,
      "Invalid images input"
    )
    .transform((files) => (files ? Array.from(files) : [])),
});

const EditCar = () => {
  const location = useLocation();
  const carData = location.state?.car;

  // 🔹 Queries
  const { data: brands } = useGetCarBrandsQuery();
  const [fetchModels, { data: models }] = useLazyGetModelsQuery();
  const [fetchTrims, { data: trims }] = useLazyGetCarTrimsQuery();
  const [fetchYears, { data: years }] = useLazyGetYearsQuery();
  const { data: categories } = useGetCarCategoriesQuery();
  const { data: regionalSpecs } = useGetCarRegionalSpecsQuery();
  const { data: horsePowers } = useGetCarHorsePowersQuery();
  const { data: seatingCapacities } = useGetCarSeatingCapacitiesQuery();
  const { data: colors } = useGetCarColorsQuery();
  const { data: doors } = useGetCarDoorsQuery();
  const { data: transmissions } = useGetTransmissionsQuery();
  const { data: bodyTypes } = useGetBodyTypesQuery();
  const { data: fuelTypes } = useGetFuelTypesQuery();
  const { data: techFeatures } = useGetCarTechFeaturesQuery();
  const { data: otherFeatures } = useGetCarOtherFeaturesQuery();

  const [updateCarListing, { isLoading }] = useUpdateCarListingMutation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editCarSchema),
  });

  // 🔹 Prefill form after queries load
  useEffect(() => {
    if (carData) {
      const brandId = brands?.carBrands?.find(
        (b) => b.name === carData.car.carBrand?.name
      )?._id;

      const modelId = models?.carModels?.find(
        (m) => m.name === carData.car.carBrand?.carModel?.name
      )?._id;

      const trimId = trims?.carTrims?.find(
        (t) => t.name === carData.car.carBrand?.carModel?.details?.carTrim
      )?._id;

      const catId = categories?.categories?.find(
        (cat) => cat.name === carData.car.category
      )?._id;

      const yearId = years?.years?.find(
        (y) => y.year == carData.car.carBrand?.carModel?.details?.modelYear
      )?._id;

      const regionalSpecId = regionalSpecs?.specs?.find(
        (s) => s.name === carData.car.regionalSpecs
      )?._id;

      const horsePowerId = horsePowers?.horsePowers?.find(
        (hp) => hp.power === carData.car.carBrand?.carModel?.details?.horsePower
      )?._id;

      const seatingId = seatingCapacities?.seatingCapacities?.find(
        (s) =>
          s.seats === carData.car.carBrand?.carModel?.details?.seatingCapacity
      )?._id;

      const interiorColorId = colors?.colors?.find(
        (c) => c.name === carData.car.carBrand?.carModel?.details?.interiorColor
      )?._id;

      const exteriorColorId = colors?.colors?.find(
        (c) => c.name === carData.car.carBrand?.carModel?.details?.exteriorColor
      )?._id;

      const doorsId = doors?.doors?.find(
        (d) => d.doors == carData.car.carBrand?.carModel?.details?.doors
      )?._id;

      const transmissionId = transmissions?.transmissions?.find(
        (t) =>
          t.transmission ===
          carData.car.carBrand?.carModel?.details?.transmission
      )?._id;

      const bodyTypeId = bodyTypes?.bodyTypes?.find(
        (b) => b.name === carData.car.carBrand?.carModel?.details?.bodyType
      )?._id;

      const fuelTypeId = fuelTypes?.fuelTypes?.find(
        (f) => f.name === carData.car.carBrand?.carModel?.details?.fuelType
      )?._id;

      const techFeatureIds =
        carData?.car?.carBrand?.carModel?.details?.techFeatures?.map(
          (tf) => techFeatures?.features?.find((f) => f.name === tf)?._id
        ) || [];

      const otherFeatureIds =
        carData?.car?.carBrand?.carModel?.details?.otherFeatures?.map(
          (tf) => otherFeatures?.features?.find((f) => f.name == tf)?._id
        ) || [];

      reset({
        carBrand: brandId || "",
        carModel: modelId || "",
        carTrim: trimId || "",
        carCategory: catId || "",
        modelYear: yearId || "",
        regionalSpecs: regionalSpecId || "",
        horsePower: horsePowerId || "",
        seatingCapacity: seatingId || "",
        interiorColor: interiorColorId || "",
        exteriorColor: exteriorColorId || "",
        carDoors: doorsId || "",
        transmission: transmissionId || "",
        bodyType: bodyTypeId || "",
        fuelType: fuelTypeId || "",
        title: carData.title || "",
        description: carData.description || "",
        rentPerDay: carData.rentPerDay || "",
        rentPerWeek: carData.rentPerWeek || "",
        rentPerMonth: carData.rentPerMonth || "",
        carInsurance: carData.car.carInsurance?.toLowerCase() || "",
        warranty: carData.car.warranty?.toLowerCase() || "",
        mileage: carData.car.mileage || "",
        location: carData.location || "",
        techFeatures: techFeatureIds,
        otherFeatures: otherFeatureIds,
      });
    }
  }, [
    carData,
    brands,
    models,
    trims,
    categories,
    years,
    regionalSpecs,
    horsePowers,
    seatingCapacities,
    colors,
    doors,
    transmissions,
    bodyTypes,
    fuelTypes,
    techFeatures,
    otherFeatures,
    reset,
  ]);
  const [selectedImages, setSelectedImages] = useState([]);

  // 🔹 Cascading dropdowns
  const selectedBrand = watch("carBrand");
  const selectedModel = watch("carModel");

  useEffect(() => {
    if (selectedBrand) fetchModels(selectedBrand);
  }, [selectedBrand, fetchModels]);

  useEffect(() => {
    if (selectedModel) {
      fetchTrims(selectedModel);
      fetchYears(selectedModel);
    }
  }, [selectedModel, fetchTrims, fetchYears]);

  // 🔹 Image handler
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    // setValue("images", [...images, ...newImages]);
    setSelectedImages(newImages);
  };

  // 🔹 Submit
  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("id", carData._id);

    Object.entries(data).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((img) => formData.append("images", img));
      } else if (Array.isArray(value)) {
        value.forEach((v) => formData.append(`${key}[]`, v));
      } else {
        formData.append(key, value);
      }
    });

    toaster.promise(
      updateCarListing({ listingId: carData._id, data: formData }).unwrap(),
      {
        loading: { title: "Updating Car...", description: "Please wait..." },
        success: (res) => ({
          title: res?.message || "Car updated successfully!",
        }),
        error: (err) => ({
          title: err?.data?.message || "Failed to update car.",
        }),
      }
    );
  };

  return (
    <Box mb="10px" borderBottom="1px solid #fff5">
      <Heading fontSize="24px" fontWeight="600" mb="30px">
        Edit Car
      </Heading>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {/* Title, Description, Rent, Insurance, Mileage, Location */}
        <div className={styles.formGroup}>
          <div>
            <input
              className={styles.input}
              placeholder="Title"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>
          <div>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              placeholder="Description"
              rows={4}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description?.message}
              </p>
            )}
          </div>
        </div>

        <div className={`${styles.grid} mt-2`}>
          <div>
            <input
              className={styles.input}
              placeholder="Rent per Day"
              {...register("rentPerDay")}
            />
            {errors.rentPerDay && (
              <p className="text-red-500 text-sm">
                {errors.rentPerDay?.message}
              </p>
            )}
          </div>
          <div>
            <input
              className={styles.input}
              placeholder="Rent per Week"
              {...register("rentPerWeek")}
            />
            {errors.rentPerWeek && (
              <p className="text-red-500 text-sm">
                {errors.rentPerWeek.message}
              </p>
            )}
          </div>
          <div>
            <input
              className={styles.input}
              placeholder="Rent per Month"
              {...register("rentPerMonth")}
            />
            {errors.rentPerMonth && (
              <p className="text-red-500 text-sm">
                {errors.rentPerMonth?.message}
              </p>
            )}
          </div>
        </div>

        <div className={styles.grid}>
          <label className={styles.labelWrapper}>
            Car Insurance
            <select {...register("carInsurance")} className={styles.select}>
              <option value="">Car Insurance</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {errors?.carInsurance && (
              <p className="text-red-500 text-sm">
                {errors.carInsurance?.message}
              </p>
            )}
          </label>
          <label className={styles.labelWrapper}>
            Warranty
            <select {...register("warranty")} className={styles.select}>
              <option value="">Warranty</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {errors.warranty && (
              <p className="text-red-500 text-sm">{errors.warranty?.message}</p>
            )}
          </label>
        </div>

        <div className={styles.grid}>
          <div>
            <input
              className={styles.input}
              placeholder="Mileage"
              type="number"
              {...register("mileage")}
            />
            {errors?.mileage && (
              <p className="text-red-500 text-sm">{errors.mileage?.message}</p>
            )}
          </div>
          <div>
            <input
              className={styles.input}
              placeholder="Location"
              {...register("location")}
            />
            {errors?.location && (
              <p className="text-red-500 text-sm">{errors.location?.message}</p>
            )}
          </div>
        </div>
        {/* Brand → Model → Trim → Year */}
        <div className={styles.grid}>
          <label className={styles.labelWrapper}>
            Brand
            <div className={styles.selectWrapper}>
              <select {...register("carBrand")} className={styles.select}>
                <option value="">Select Brand</option>
                {(brands?.carBrands || []).map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              {errors?.carBrand && (
                <p className="text-red-500 text-sm">
                  {errors.carBrand?.message}
                </p>
              )}
            </div>
          </label>
          <label className={styles.labelWrapper}>
            Model
            <div className={styles.selectWrapper}>
              <select
                {...register("carModel")}
                className={styles.select}
                disabled={!selectedBrand}
              >
                <option value="">Select Model</option>
                {(models?.carModels || []).map((model) => (
                  <option key={model._id} value={model._id}>
                    {model.name}
                  </option>
                ))}
              </select>
              {errors?.carModel && (
                <p className="text-red-500 text-sm">
                  {errors.carModel?.message}
                </p>
              )}
            </div>
          </label>
          <label className={styles.labelWrapper}>
            Trim
            <div className={styles.selectWrapper}>
              <select
                {...register("carTrim")}
                className={styles.select}
                disabled={!selectedModel}
              >
                <option value="">Select Trim</option>
                {(trims?.carTrims || []).map((trim) => (
                  <option key={trim._id} value={trim._id}>
                    {trim.name}
                  </option>
                ))}
              </select>
              {errors?.carTrim && (
                <p className="text-red-500 text-sm">
                  {errors.carTrim?.message}
                </p>
              )}
            </div>
          </label>
          <label className={styles.labelWrapper}>
            Year
            <div className={styles.selectWrapper}>
              <select
                {...register("modelYear")}
                className={styles.select}
                disabled={!selectedModel}
              >
                <option value="">Select Year</option>
                {(years?.years || []).map((year) => (
                  <option key={year._id} value={year._id}>
                    {year.year}
                  </option>
                ))}
              </select>
              {errors?.modelYear && (
                <p className="text-red-500 text-sm">
                  {errors.modelYear?.message}
                </p>
              )}
            </div>
          </label>
          <label className={styles.labelWrapper}>
            Category
            <div className={styles.selectWrapper}>
              <select
                {...register("carCategory")}
                className={styles.select}
                disabled={!selectedModel}
              >
                <option value="">Select Category</option>
                {(categories?.categories || []).map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors?.carCategory && (
                <p className="text-red-500 text-sm">
                  {errors.carCategory?.message}
                </p>
              )}
            </div>
          </label>
        </div>

        {/* Remaining dropdowns */}
        <div className={styles.grid}>
          <label className={styles.labelWrapper}>
            Regional Specs
            <div className={styles.selectWrapper}>
              <select {...register("regionalSpecs")} className={styles.select}>
                <option value="">Regional Specs</option>
                {(regionalSpecs?.specs || []).map((spec) => (
                  <option key={spec._id} value={spec._id}>
                    {spec.name}
                  </option>
                ))}
              </select>
              {errors?.regionalSpecs && (
                <p className="text-red-500 text-sm">
                  {errors.regionalSpecs?.message}
                </p>
              )}
            </div>
          </label>

          <label className={styles.labelWrapper}>
            Horse Power
            <div className={styles.selectWrapper}>
              <select {...register("horsePower")} className={styles.select}>
                <option value="">Horse Power</option>
                {(horsePowers?.horsePowers || []).map((hp) => (
                  <option key={hp._id} value={hp._id}>
                    {hp.power}
                  </option>
                ))}
              </select>
              {errors?.horsePower && (
                <p className="text-red-500 text-sm">
                  {errors.horsePower?.message}
                </p>
              )}
            </div>
          </label>

          <label className={styles.labelWrapper}>
            Seating Capacity
            <div className={styles.selectWrapper}>
              <select
                {...register("seatingCapacity")}
                className={styles.select}
              >
                <option value="">Seating Capacity</option>
                {(seatingCapacities?.seatingCapacities || []).map((sc) => (
                  <option key={sc._id} value={sc._id}>
                    {sc.seats}
                  </option>
                ))}
              </select>
              {errors?.seatingCapacity && (
                <p className="text-red-500 text-sm">
                  {errors.seatingCapacity?.message}
                </p>
              )}
            </div>
          </label>

          <label className={styles.labelWrapper}>
            Interior Color
            <div className={styles.selectWrapper}>
              <select {...register("interiorColor")} className={styles.select}>
                <option value="">Interior Color</option>
                {(colors?.colors || []).map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors?.interiorColor && (
                <p className="text-red-500 text-sm">
                  {errors.interiorColor?.message}
                </p>
              )}
            </div>
          </label>

          <label className={styles.labelWrapper}>
            Exterior Color
            <div className={styles.selectWrapper}>
              <select {...register("exteriorColor")} className={styles.select}>
                <option value="">Exterior Color</option>
                {(colors?.colors || []).map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors?.exteriorColor && (
                <p className="text-red-500 text-sm">
                  {errors.exteriorColor?.message}
                </p>
              )}
            </div>
          </label>

          {/* Doors, Transmission, Body Type, Fuel Type */}
          <label className={styles.labelWrapper}>
            Doors
            <div className={styles.selectWrapper}>
              <select {...register("carDoors")} className={styles.select}>
                <option value="">Select Doors</option>
                {(doors?.doors || []).map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.doors}
                  </option>
                ))}
              </select>
              {errors?.carDoors && (
                <p className="text-red-500 text-sm">
                  {errors.carDoors?.message}
                </p>
              )}
            </div>
          </label>

          <label className={styles.labelWrapper}>
            Transmission
            <div className={styles.selectWrapper}>
              <select {...register("transmission")} className={styles.select}>
                <option value="">Select Transmission</option>
                {(transmissions?.transmissions || []).map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.transmission}
                  </option>
                ))}
              </select>
              {errors?.transmission && (
                <p className="text-red-500 text-sm">
                  {errors.transmission?.message}
                </p>
              )}
            </div>
          </label>

          <label className={styles.labelWrapper}>
            Body Type
            <div className={styles.selectWrapper}>
              <select {...register("bodyType")} className={styles.select}>
                <option value="">Select Body Type</option>
                {(bodyTypes?.bodyTypes || []).map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
              {errors?.bodyType && (
                <p className="text-red-500 text-sm">
                  {errors.bodyType?.message}
                </p>
              )}
            </div>
          </label>

          <label className={styles.labelWrapper}>
            Fuel Type
            <div className={styles.selectWrapper}>
              <select {...register("fuelType")} className={styles.select}>
                <option value="">Select Fuel Type</option>
                {(fuelTypes?.fuelTypes || []).map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.name}
                  </option>
                ))}
              </select>
              {errors?.fuelType && (
                <p className="text-red-500 text-sm">
                  {errors.fuelType?.message}
                </p>
              )}
            </div>
          </label>
        </div>

        {/* Tech & Other Features */}
        <div className={styles.sectionHeader}>Technical Features</div>
        {/* <button
          type="button"
          onClick={() => setShowTechFeatures(!showTechFeatures)}
          className={`${styles.toggleButton} ${styles.button}`}
        >
          {showTechFeatures ? "Hide Features" : "Add Features"}
        </button> */}
        {/* {showTechFeatures && ( */}
        <div className={`flex justify-start items-baseline flex-wrap gap-x-3`}>
          {techFeatures?.features?.length > 0 ? (
            (techFeatures?.features || []).map((f) => (
              <label key={f._id} className={styles.featureBox}>
                <input
                  type="checkbox"
                  {...register("techFeatures")}
                  value={f._id}
                />
                <span>{f.name}</span>
              </label>
            ))
          ) : (
            <Text w="100%" textAlign="center">
              No features available
            </Text>
          )}
        </div>
        {/* )} */}

        <div className={styles.sectionHeader}>Other Features</div>
        {/* <button
          type="button"
          onClick={() => setShowOtherFeatures(!showOtherFeatures)}
          className={`${styles.toggleButton} ${styles.button}`}
        >
          {showOtherFeatures ? "Hide Features" : "Add Features"}
        </button> */}
        {/* {showOtherFeatures && ( */}
        <div className={styles.featuresGrid}>
          {otherFeatures?.features?.length > 0 ? (
            (otherFeatures?.features || []).map((f) => (
              <label key={f._id} className={styles.featureBox}>
                <input
                  type="checkbox"
                  {...register("otherFeatures")}
                  value={f._id}
                />
                <span>{f.name}</span>
              </label>
            ))
          ) : (
            <Text w="100%" textAlign="center">
              No features available
            </Text>
          )}
        </div>
        {/* )} */}

        {/* Images */}
        <div className={styles.imageUploadSection}>
          <div className={styles.sectionHeader}>Add Images</div>
          <input
            {...register("images", {
              onChange: (e) => {
                handleImageChange(e);
              },
            })}
            id="file-upload"
            type="file"
            className={styles.fileInput}
            multiple
            hidden
          />
          <label htmlFor="file-upload" className={styles.uploadLabel}>
            Choose Files
          </label>

          {errors?.images && (
            <p className="text-red-500 text-sm">{errors.images?.message}</p>
          )}
          {/* {images.length > 0 && (
            <div className={styles.imageToggleWrapper}>
              <button
                type="button"
                onClick={() => setShowImages(!showImages)}
                className={styles.toggleButton}
              >
                {showImages ? "Hide Images" : "Show Images"}
              </button>
            </div>
          )} */}
          {selectedImages.length > 0 && (
            <div className={styles.imagePreviewGrid}>
              {selectedImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={img.name}
                  className={styles.imagePreview}
                />
              ))}
            </div>
          )}
        </div>

        <div style={{ textAlign: "right", marginTop: "50px" }}>
          <button className={styles.button} type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Car"}
          </button>
        </div>
      </form>
    </Box>
  );
};

export default EditCar;
