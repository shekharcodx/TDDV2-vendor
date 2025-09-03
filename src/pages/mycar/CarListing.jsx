"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import styles from "./carlist.module.css";
import { toaster } from "@/components/ui/toaster";

import {
  useGetCarBrandsQuery,
  useLazyGetModelsQuery,
  useLazyGetCarTrimsQuery,
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
  useAddCarListingMutation,
} from "../../../app/api/carListingApi";

const CarListing = () => {
  // 🔹 Queries
  const { data: brands } = useGetCarBrandsQuery();
  const [fetchModels, { data: models }] = useLazyGetModelsQuery();
  const [fetchTrims, { data: trims }] = useLazyGetCarTrimsQuery();
  const [fetchYears, { data: years }] = useLazyGetYearsQuery();
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

  const [addCarListing, { isLoading }] = useAddCarListingMutation();

  // 🔹 Hook Form
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      carBrand: "",
      carModel: "",
      carTrim: "",
      modelYear: "",
      regionalSpecs: "",
      horsePower: "",
      seatingCapacity: "",
      interiorColor: "",
      exteriorColor: "",
      carDoors: "",
      transmission: "",
      bodyType: "",
      fuelType: "",
      techFeatures: [],
      otherFeatures: [],
      images: [],
      title: "",
      description: "",
      rentPerDay: "",
      rentPerWeek: "",
      rentPerMonth: "",
      carInsurance: "",
      warranty: "",
      mileage: "",
      location: "",
    },
  });

  const [showTechFeatures, setShowTechFeatures] = useState(false);
  const [showOtherFeatures, setShowOtherFeatures] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const images = watch("images");

  // 🔹 Cascading dropdowns
  const selectedBrand = watch("carBrand");
  const selectedModel = watch("carModel");

  useEffect(() => {
    if (selectedBrand) {
      setValue("carModel", "");
      setValue("carTrim", "");
      setValue("modelYear", "");
      fetchModels(selectedBrand);
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedModel) {
      setValue("carTrim", "");
      setValue("modelYear", "");
      fetchTrims(selectedModel);
      fetchYears(selectedModel);
    }
  }, [selectedModel]);

  // 🔹 Image handler
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setValue("images", [...images, ...newImages]);
  };

  // 🔹 Submit
  const onSubmit = (data) => {
    if (!data.carBrand || !data.carModel || !data.modelYear) {
      toaster.error({ title: "Please select brand, model, and year." });
      return;
    }
    if (!data.location.trim()) {
      toaster.error({ title: "Location is required." });
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((img) => formData.append("images", img.file || img.url));
      } else if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key + "[]", v));
      } else {
        formData.append(key, value);
      }
    });

    toaster.promise(addCarListing(formData).unwrap(), {
      loading: { title: "Saving Car...", description: "Please wait..." },
      success: (res) => ({ title: res?.message || "Car saved successfully!" }),
      error: (err) => ({ title: err?.data?.message || "Failed to save car." }),
    });
  };

  return (
    <div className={styles.page}>
      <main className={styles.container}>
        <h2 className={styles.title}>Add Car Details</h2>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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
              </div>
            </label>
          </div>

          {/* Next row: Regional Specs, Horse Power, Seating, Interior Color */}
          <div className={styles.grid}>
            <label className={styles.labelWrapper}>
              Regional Specs
              <div className={styles.selectWrapper}>
                <select
                  {...register("regionalSpecs")}
                  className={styles.select}
                >
                  <option value="">Regional Specs</option>
                  {(regionalSpecs?.specs || []).map((spec) => (
                    <option key={spec._id} value={spec._id}>
                      {spec.name}
                    </option>
                  ))}
                </select>
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
              </div>
            </label>

            <label className={styles.labelWrapper}>
              Interior Color
              <div className={styles.selectWrapper}>
                <select
                  {...register("interiorColor")}
                  className={styles.select}
                >
                  <option value="">Interior Color</option>
                  {(colors?.colors || []).map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </label>
          </div>

          {/* Next row: Exterior Color, Doors, Transmission, Body Type */}
          <div className={styles.grid}>
            <label className={styles.labelWrapper}>
              Exterior Color
              <div className={styles.selectWrapper}>
                <select
                  {...register("exteriorColor")}
                  className={styles.select}
                >
                  <option value="">Exterior Color</option>
                  {(colors?.colors || []).map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </label>

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
              </div>
            </label>
          </div>

          {/* Fuel Type */}
          <div className={styles.grid}>
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
              </div>
            </label>
            <div></div><div></div><div></div>
          </div>

          {/* Tech & Other Features */}
          <div className={styles.sectionHeader}>Technical Features</div>
          <button
            type="button"
            onClick={() => setShowTechFeatures(!showTechFeatures)}
            className={`${styles.toggleButton} ${styles.button}`}
          >
            {showTechFeatures ? "Hide Features" : "Add Features"}
          </button>
          {showTechFeatures && (
            <div className={styles.featuresGrid}>
              {(techFeatures?.features || []).map((f) => (
                <label key={f._id} className={styles.featureBox}>
                  <input
                    type="checkbox"
                    {...register("techFeatures")}
                    value={f._id}
                  />
                  <span>{f.name}</span>
                </label>
              ))}
            </div>
          )}

          <div className={styles.sectionHeader}>Other Features</div>
          <button
            type="button"
            onClick={() => setShowOtherFeatures(!showOtherFeatures)}
            className={`${styles.toggleButton} ${styles.button}`}
          >
            {showOtherFeatures ? "Hide Features" : "Add Features"}
          </button>
          {showOtherFeatures && (
            <div className={styles.featuresGrid}>
              {(otherFeatures?.features || []).map((f) => (
                <label key={f._id} className={styles.featureBox}>
                  <input
                    type="checkbox"
                    {...register("otherFeatures")}
                    value={f._id}
                  />
                  <span>{f.name}</span>
                </label>
              ))}
            </div>
          )}

          {/* Images */}
          <div className={styles.imageUploadSection}>
            <div className={styles.sectionHeader}>Add Images</div>
            <input
              id="file-upload"
              type="file"
              className={styles.fileInput}
              onChange={handleImageChange}
              multiple
              hidden
            />
            <label htmlFor="file-upload" className={styles.uploadLabel}>
              Choose Files
            </label>
            {images.length > 0 && (
              <div className={styles.imageToggleWrapper}>
                <button
                  type="button"
                  onClick={() => setShowImages(!showImages)}
                  className={styles.toggleButton}
                >
                  {showImages ? "Hide Images" : "Show Images"}
                </button>
              </div>
            )}
            {showImages && images.length > 0 && (
              <div className={styles.imagePreviewGrid}>
                {images.map((img, idx) => (
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

          {/* Title, Description, Rent, Insurance, Mileage, Location */}
          <div className={styles.formGroup}>
            <input
              className={styles.input}
              placeholder="Title"
              {...register("title")}
            />
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              placeholder="Description"
              rows={4}
              {...register("description")}
            />
          </div>

          <div className={`${styles.grid} ${styles.gapTop}`}>
            <input
              className={styles.input}
              placeholder="Rent per Day"
              {...register("rentPerDay")}
            />
            <input
              className={styles.input}
              placeholder="Rent per Week"
              {...register("rentPerWeek")}
            />
            <input
              className={styles.input}
              placeholder="Rent per Month"
              {...register("rentPerMonth")}
            />
          </div>

          <div className={styles.grid}>
            <label className={styles.labelWrapper}>
              Car Insurance
              <select {...register("carInsurance")} className={styles.select}>
                <option value="">Car Insurance</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
            <label className={styles.labelWrapper}>
              Warranty
              <select {...register("warranty")} className={styles.select}>
                <option value="">Warranty</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
          </div>

          <div className={styles.grid}>
            <input
              className={styles.input}
              placeholder="Mileage"
              type="number"
              {...register("mileage")}
            />
            <input
              className={styles.input}
              placeholder="Location"
              {...register("location")}
            />
          </div>

          <div style={{ textAlign: "right", marginTop: "20px" }}>
            <button
              className={styles.button}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Car"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CarListing;
