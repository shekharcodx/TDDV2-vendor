// import React, { useState } from "react";
// import styles from "./carlist.module.css";
// import { toaster } from "@/components/ui/toaster";
// import {
//   useGetCarBrandsQuery,
//   useLazyGetModelsQuery,
//   useLazyGetCarTrimsQuery,
//   useLazyGetYearsQuery,
//   useGetCarRegionalSpecsQuery,
//   useGetCarHorsePowersQuery,
//   useGetCarSeatingCapacitiesQuery,
//   useGetCarColorsQuery,
//   useGetCarDoorsQuery,
//   useGetTransmissionsQuery,
//   useGetFuelTypesQuery,
//   useGetCarTechFeaturesQuery,
//   useGetCarOtherFeaturesQuery,
//     useCreateListingMutation,

// } from "@/app/api/carListingApi";

// const CarListing = () => {
//   // 🔹 Brand → Model → Trim → Year
//   const { data: brands } = useGetCarBrandsQuery();
//   const [fetchModels, { data: models }] = useLazyGetModelsQuery();
//   const [fetchTrims, { data: trims }] = useLazyGetCarTrimsQuery();
//   const [fetchYears, { data: years }] = useLazyGetYearsQuery();

//   // 🔹 Static dropdowns
//   const { data: regionalSpecs } = useGetCarRegionalSpecsQuery();
//   const { data: horsePowers } = useGetCarHorsePowersQuery();
//   const { data: seatingCapacities } = useGetCarSeatingCapacitiesQuery();
//   const { data: colors } = useGetCarColorsQuery();
//   const { data: doors } = useGetCarDoorsQuery();
//   const { data: transmissions } = useGetTransmissionsQuery();
//   const { data: fuelTypes } = useGetFuelTypesQuery();
//   const { data: techFeatures } = useGetCarTechFeaturesQuery();
//   const { data: otherFeatures } = useGetCarOtherFeaturesQuery();

//   // 🔹 State
//   const [selectedBrand, setSelectedBrand] = useState("");
//   const [selectedModel, setSelectedModel] = useState("");
//   const [selectedTrim, setSelectedTrim] = useState("");
//   const [selectedYear, setSelectedYear] = useState("");

//   const [showTechFeatures, setShowTechFeatures] = useState(false);
//   const [showOtherFeatures, setShowOtherFeatures] = useState(false);
//   const [selectedTechFeatures, setSelectedTechFeatures] = useState([]);
//   const [selectedOtherFeatures, setSelectedOtherFeatures] = useState([]);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [rentPerDay, setRentPerDay] = useState("");
//   const [rentPerWeek, setRentPerWeek] = useState(""); // ✅ added rent per week
//   const [rentPerMonth, setRentPerMonth] = useState("");
//   const [insurance, setInsurance] = useState("");
//   const [warranty, setWarranty] = useState("");
//   const [images, setImages] = useState([]);
//   const [showImages, setShowImages] = useState(false);

//   const [exteriorColor, setExteriorColor] = useState(""); // ✅ new state
//   const [interiorColor, setInteriorColor] = useState(""); // ✅ new state

//   // Handlers
//   const handleBrandChange = async (e) => {
//     const brandId = e.target.value;
//     setSelectedBrand(brandId);
//     setSelectedModel("");
//     setSelectedTrim("");
//     setSelectedYear("");
//     if (brandId) await fetchModels(brandId);
//   };

//   const handleModelChange = async (e) => {
//     const modelId = e.target.value;
//     setSelectedModel(modelId);
//     setSelectedTrim("");
//     setSelectedYear("");
//     if (modelId) {
//       await fetchTrims(modelId);
//       await fetchYears(modelId);
//     }
//   };

//   const handleTechFeatureChange = (featureId) => {
//     setSelectedTechFeatures((prev) =>
//       prev.includes(featureId)
//         ? prev.filter((f) => f !== featureId)
//         : [...prev, featureId]
//     );
//   };

//   const handleOtherFeatureChange = (featureId) => {
//     setSelectedOtherFeatures((prev) =>
//       prev.includes(featureId)
//         ? prev.filter((f) => f !== featureId)
//         : [...prev, featureId]
//     );
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     const newImages = files.map((file) => ({
//       name: file.name,
//       url: URL.createObjectURL(file),
//     }));
//     setImages((prev) => [...prev, ...newImages]);
//   };
//   const [createListing, { isLoading: isSaving }] = useCreateListingMutation();

//   console.log("CarListing:", { models, trims, years });

//   return (
//     <div className={styles.page}>
//       <main className={styles.container}>
//         <h2 className={styles.title}>Add Car Details</h2>

//         <form className={styles.form}>
//           {/* Brand → Model → Trim → Year */}
//           <div className={styles.grid}>
//             <div className={styles.selectWrapper}>
//               <select
//                 value={selectedBrand}
//                 onChange={handleBrandChange}
//                 className={styles.select}
//               >
//                 <option value="">Select Brand</option>
//                 {brands?.carBrands?.map((brand) => (
//                   <option key={brand._id} value={brand._id}>
//                     {brand.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles.selectWrapper}>
//               <select
//                 value={selectedModel}
//                 onChange={handleModelChange}
//                 className={styles.select}
//                 disabled={!selectedBrand}
//               >
//                 <option value="">Select Model</option>
//                 {models?.carModels?.map((model) => (
//                   <option key={model._id} value={model._id}>
//                     {model.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles.selectWrapper}>
//               <select
//                 value={selectedTrim}
//                 onChange={(e) => setSelectedTrim(e.target.value)}
//                 className={styles.select}
//                 disabled={!selectedModel}
//               >
//                 <option value="">Select Trim</option>
//                 {trims?.carTrims?.map((trim) => (
//                   <option key={trim._id} value={trim._id}>
//                     {trim.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles.selectWrapper}>
//               <select
//                 value={selectedYear}
//                 onChange={(e) => setSelectedYear(e.target.value)}
//                 className={styles.select}
//                 disabled={!selectedModel}
//               >
//                 <option value="">Select Year</option>
//                 {years?.years?.map((year, idx) => (
//                   <option key={idx} value={year.year}>
//                     {year.year}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Specs dropdowns */}
//           <div className={styles.grid}>
//             <div className={styles.selectWrapper}>
//               <select className={styles.select}>
//                 <option value="">Select Regional Specs</option>
//                 {regionalSpecs?.specs?.map((spec) => (
//                   <option key={spec._id} value={spec._id}>
//                     {spec.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles.selectWrapper}>
//               <select className={styles.select}>
//                 <option value="">Select Horse Power</option>
//                 {horsePowers?.horsePowers?.map((hp) => (
//                   <option key={hp._id} value={hp._id}>
//                     {hp.power}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles.selectWrapper}>
//               <select className={styles.select}>
//                 <option value="">Select Seating Capacity</option>
//                 {seatingCapacities?.seatingCapacities?.map((sc) => (
//                   <option key={sc._id} value={sc._id}>
//                     {sc.seats}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* ✅ Exterior Color */}
//             <div className={styles.selectWrapper}>
//               <select
//                 className={styles.select}
//                 value={exteriorColor}
//                 onChange={(e) => setExteriorColor(e.target.value)}
//               >
//                 <option value="">Select Exterior Color</option>
//                 {colors?.colors?.map((c) => (
//                   <option key={c._id} value={c._id}>
//                     {c.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* ✅ Interior Color */}
//             <div className={styles.selectWrapper}>
//               <select
//                 className={styles.select}
//                 value={interiorColor}
//                 onChange={(e) => setInteriorColor(e.target.value)}
//               >
//                 <option value="">Select Interior Color</option>
//                 {colors?.colors?.map((c) => (
//                   <option key={c._id} value={c._id}>
//                     {c.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles.selectWrapper}>
//               <select className={styles.select}>
//                 <option value="">Select Doors</option>
//                 {doors?.doors?.map((d) => (
//                   <option key={d._id} value={d._id}>
//                     {d.doors}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles.selectWrapper}>
//               <select className={styles.select}>
//                 <option value="">Select Transmission</option>
//                 {transmissions?.transmissions?.map((t) => (
//                   <option key={t._id} value={t._id}>
//                     {t.transmission}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles.selectWrapper}>
//               <select className={styles.select}>
//                 <option value="">Select Fuel Type</option>
//                 {fuelTypes?.fuelTypes?.map((f) => (
//                   <option key={f._id} value={f._id}>
//                     {f.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Technical Features */}
//           <div className={styles.sectionHeader}>Technical Features</div>
//           <div style={{ marginBottom: "10px" }}>
//             <button
//               type="button"
//               onClick={() => setShowTechFeatures(!showTechFeatures)}
//               className={`${styles.toggleButton} ${styles.button}`}
//             >
//               {showTechFeatures ? "Hide Features" : "Add Features"}
//             </button>
//           </div>
//           {showTechFeatures && (
//             <div className={styles.featuresGrid}>
//               {techFeatures?.features?.map((f) => (
//                 <div key={f._id} className={styles.featureBox}>
//                   <label>
//                     <input
//                       type="checkbox"
//                       checked={selectedTechFeatures.includes(f._id)}
//                       onChange={() => handleTechFeatureChange(f._id)}
//                     />
//                     <span>{f.name}</span>
//                   </label>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Other Features */}
//           <div className={styles.sectionHeader}>Other Features</div>
//           <div style={{ marginBottom: "10px" }}>
//             <button
//               type="button"
//               onClick={() => setShowOtherFeatures(!showOtherFeatures)}
//               className={`${styles.toggleButton} ${styles.button}`}
//             >
//               {showOtherFeatures ? "Hide Features" : "Add Features"}
//             </button>
//           </div>
//           {showOtherFeatures && (
//             <div className={styles.featuresGrid}>
//               {otherFeatures?.features?.map((f) => (
//                 <div key={f._id} className={styles.featureBox}>
//                   <label>
//                     <input
//                       type="checkbox"
//                       checked={selectedOtherFeatures.includes(f._id)}
//                       onChange={() => handleOtherFeatureChange(f._id)}
//                     />
//                     <span>{f.name}</span>
//                   </label>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Image Upload */}
//           <div className={styles.imageUploadSection}>
//             <div className={styles.sectionHeader}>Add Images</div>

//             <input
//               id="file-upload"
//               type="file"
//               className={styles.fileInput}
//               onChange={handleImageChange}
//               multiple
//               hidden
//             />

//             <label
//               htmlFor="file-upload"
//               className={`${styles.uploadLabel} ${styles.button}`}
//             >
//               Choose Files
//             </label>

//             {images.length > 0 && (
//               <div style={{ marginTop: "10px", marginBottom: "10px" }}>
//                 <button
//                   type="button"
//                   onClick={() => setShowImages(!showImages)}
//                   className={`${styles.toggleButton} ${styles.button}`}
//                 >
//                   {showImages ? "Hide Images" : "Show Images"}
//                 </button>
//               </div>
//             )}

//             {showImages && (
//               <div className={styles.imagePreviewGrid}>
//                 {images.map((img, idx) => (
//                   <img
//                     key={idx}
//                     src={img.url}
//                     alt={img.name}
//                     className={styles.imagePreview}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Title & Description */}
//           <div className={styles.formGroup}>
//             <input
//               className={styles.input}
//               placeholder="Title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />
//             <textarea
//               className={`${styles.input} ${styles.textarea}`}
//               placeholder="Description"
//               rows={4}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//           </div>

//           {/* Rent */}
//           <div className={`${styles.grid} ${styles.gapTop}`}>
//             <input
//               className={styles.input}
//               placeholder="Rent per Day"
//               value={rentPerDay}
//               onChange={(e) => setRentPerDay(e.target.value)}
//             />
//             <input
//               className={styles.input}
//               placeholder="Rent per Week"
//               value={rentPerWeek}
//               onChange={(e) => setRentPerWeek(e.target.value)}
//             />
//             <input
//               className={styles.input}
//               placeholder="Rent per Month"
//               value={rentPerMonth}
//               onChange={(e) => setRentPerMonth(e.target.value)}
//             />
//           </div>

//           {/* Insurance & Warranty */}
//           <div className={styles.grid}>
//             <div className={styles.selectWrapper}>
//               <select
//                 className={styles.select}
//                 value={insurance}
//                 onChange={(e) => setInsurance(e.target.value)}
//               >
//                 <option value="">Car Insurance</option>
//                 <option value="yes">Yes</option>
//                 <option value="no">No</option>
//               </select>
//             </div>

//             <div className={styles.selectWrapper}>
//               <select
//                 className={styles.select}
//                 value={warranty}
//                 onChange={(e) => setWarranty(e.target.value)}
//               >
//                 <option value="">Warranty</option>
//                 <option value="yes">Yes</option>
//                 <option value="no">No</option>
//               </select>
//             </div>
//           </div>

//           <div style={{ textAlign: "right", marginTop: "20px" }}>
//             <button className={styles.button} type="submit">
//               Save Car
//             </button>
//           </div>
//         </form>
//       </main>
//     </div>
//   );
// };

// export default CarListing;
// import React, { useState } from "react";
// import styles from "./carlist.module.css";
// import { toaster } from "@/components/ui/toaster";
// import {
//   useGetCarBrandsQuery,
//   useLazyGetModelsQuery,
//   useLazyGetCarTrimsQuery,
//   useLazyGetYearsQuery,
//   useGetCarRegionalSpecsQuery,
//   useGetCarHorsePowersQuery,
//   useGetCarSeatingCapacitiesQuery,
//   useGetCarColorsQuery,
//   useGetCarDoorsQuery,
//   useGetTransmissionsQuery,
//   useGetFuelTypesQuery,
//   useGetCarTechFeaturesQuery,
//   useGetCarOtherFeaturesQuery,
//   useGetBodyTypesQuery,
//   useCreateListingMutation,
// } from "@/app/api/carListingApi";

// const CarListing = () => {
//   // 🔹 Brand → Model → Trim → Year
//   const { data: brands } = useGetCarBrandsQuery();
//   const [fetchModels, { data: models }] = useLazyGetModelsQuery();
//   const [fetchTrims, { data: trims }] = useLazyGetCarTrimsQuery();
//   const [fetchYears, { data: years }] = useLazyGetYearsQuery();

//   // 🔹 Static dropdowns
//   const { data: regionalSpecs } = useGetCarRegionalSpecsQuery();
//   const { data: horsePowers } = useGetCarHorsePowersQuery();
//   const { data: seatingCapacities } = useGetCarSeatingCapacitiesQuery();
//   const { data: colors } = useGetCarColorsQuery();
//   const { data: doors } = useGetCarDoorsQuery();
//   const { data: transmissions } = useGetTransmissionsQuery();
//   const { data: fuelTypes } = useGetFuelTypesQuery();
//   const { data: techFeatures } = useGetCarTechFeaturesQuery();
//   const { data: otherFeatures } = useGetCarOtherFeaturesQuery();
//   const { data: bodyTypes } = useGetBodyTypesQuery();

//   // 🔹 State
//   const [selectedBrand, setSelectedBrand] = useState("");
//   const [selectedModel, setSelectedModel] = useState("");
//   const [selectedTrim, setSelectedTrim] = useState("");
//   const [selectedYear, setSelectedYear] = useState("");
//   const [selectedRegionalSpecs, setSelectedRegionalSpecs] = useState("");
//   const [selectedHorsePower, setSelectedHorsePower] = useState("");
//   const [selectedSeatingCapacity, setSelectedSeatingCapacity] = useState("");
//   const [selectedBodyType, setSelectedBodyType] = useState("");
//   const [selectedDoors, setSelectedDoors] = useState("");
//   const [selectedTransmission, setSelectedTransmission] = useState("");
//   const [selectedFuelType, setSelectedFuelType] = useState("");
//   const [interiorColor, setInteriorColor] = useState("");
//   const [exteriorColor, setExteriorColor] = useState("");
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [rentPerDay, setRentPerDay] = useState("");
//   const [rentPerWeek, setRentPerWeek] = useState("");
//   const [rentPerMonth, setRentPerMonth] = useState("");
//   const [insurance, setInsurance] = useState("");
//   const [warranty, setWarranty] = useState("");
//   const [mileage, setMileage] = useState("");
//   const [location, setLocation] = useState("");
//   const [images, setImages] = useState([]);
//   const [showImages, setShowImages] = useState(false);
//   const [selectedTechFeatures, setSelectedTechFeatures] = useState([]);
//   const [selectedOtherFeatures, setSelectedOtherFeatures] = useState([]);
//   const [createListing, { isLoading }] = useCreateListingMutation();

//   // Handlers
//   const handleBrandChange = async (e) => {
//     const brandId = e.target.value;
//     setSelectedBrand(brandId);
//     setSelectedModel("");
//     setSelectedTrim("");
//     setSelectedYear("");
//     if (brandId) await fetchModels(brandId);
//   };

//   const handleModelChange = async (e) => {
//     const modelId = e.target.value;
//     setSelectedModel(modelId);
//     setSelectedTrim("");
//     setSelectedYear("");
//     if (modelId) {
//       await fetchTrims(modelId);
//       await fetchYears(modelId);
//     }
//   };

//   const handleTechFeatureChange = (featureId) => {
//     setSelectedTechFeatures((prev) =>
//       prev.includes(featureId)
//         ? prev.filter((f) => f !== featureId)
//         : [...prev, featureId]
//     );
//   };

//   const handleOtherFeatureChange = (featureId) => {
//     setSelectedOtherFeatures((prev) =>
//       prev.includes(featureId)
//         ? prev.filter((f) => f !== featureId)
//         : [...prev, featureId]
//     );
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     const newImages = files.map((file) => ({
//       file,
//       name: file.name,
//       url: URL.createObjectURL(file),
//     }));
//     setImages((prev) => [...prev, ...newImages]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = {
//       carBrand: selectedBrand,
//       carModel: selectedModel,
//       carTrim: selectedTrim,
//       modelYear: selectedYear,
//       regionalSpecs: selectedRegionalSpecs,
//       horsePower: selectedHorsePower,
//       seatingCapacity: selectedSeatingCapacity,
//       bodyType: selectedBodyType,
//       carDoors: selectedDoors,
//       transmission: selectedTransmission,
//       fuelType: selectedFuelType,
//       interiorColor,
//       exteriorColor,
//       mileage: Number(mileage),
//       title,
//       description,
//       rentPerDay: Number(rentPerDay),
//       rentPerWeek: Number(rentPerWeek),
//       rentPerMonth: Number(rentPerMonth),
//       carInsurance: insurance,
//       warranty,
//       location,
//       techFeatures: selectedTechFeatures,
//       otherFeatures: selectedOtherFeatures,
//       images: images.map((img) => img.file),
//     };

//     toaster.promise(
//       createListing(formData).unwrap(),
//       {
//         loading: { title: "Saving Car Listing...", description: "Please wait" },
//         success: (res) => ({ title: res?.message || "Car listing saved successfully!" }),
//         error: (err) => ({ title: err?.data?.message || "Failed to save car listing." }),
//       }
//     );
//   };

//   return (
//     <div className={styles.page}>
//       <main className={styles.container}>
//         <h2 className={styles.title}>Add Car Details</h2>
//         <form className={styles.form} onSubmit={handleSubmit}>
//           {/* Brand → Model → Trim → Year */}
//           <div className={styles.grid}>
//             <div className={styles.selectWrapper}>
//               <select value={selectedBrand} onChange={handleBrandChange} className={styles.select}>
//                 <option value="">Select Brand</option>
//                 {brands?.carBrands?.map((b) => (
//                   <option key={b._id} value={b._id}>{b.name}</option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles.selectWrapper}>
//               <select value={selectedModel} onChange={handleModelChange} className={styles.select} disabled={!selectedBrand}>
//                 <option value="">Select Model</option>
//                 {models?.carModels?.map((m) => (
//                   <option key={m._id} value={m._id}>{m.name}</option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles.selectWrapper}>
//               <select value={selectedTrim} onChange={(e) => setSelectedTrim(e.target.value)} className={styles.select} disabled={!selectedModel}>
//                 <option value="">Select Trim</option>
//                 {trims?.carTrims?.map((t) => (
//                   <option key={t._id} value={t._id}>{t.name}</option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles.selectWrapper}>
//               <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className={styles.select} disabled={!selectedModel}>
//                 <option value="">Select Year</option>
//                 {years?.years?.map((y) => (
//                   <option key={y._id} value={y._id}>{y.year}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Specs */}
//           <div className={styles.grid}>
//             <div className={styles.selectWrapper}>
//               <select value={selectedRegionalSpecs} onChange={(e) => setSelectedRegionalSpecs(e.target.value)} className={styles.select}>
//                 <option value="">Select Regional Specs</option>
//                 {regionalSpecs?.specs?.map((r) => (
//                   <option key={r._id} value={r._id}>{r.name}</option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles.selectWrapper}>
//               <select value={selectedHorsePower} onChange={(e) => setSelectedHorsePower(e.target.value)} className={styles.select}>
//                 <option value="">Select Horse Power</option>
//                 {horsePowers?.horsePowers?.map((hp) => (
//                   <option key={hp._id} value={hp._id}>{hp.power}</option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles.selectWrapper}>
//               <select value={selectedSeatingCapacity} onChange={(e) => setSelectedSeatingCapacity(e.target.value)} className={styles.select}>
//                 <option value="">Select Seating Capacity</option>
//                 {seatingCapacities?.seatingCapacities?.map((sc) => (
//                   <option key={sc._id} value={sc._id}>{sc.seats}</option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles.selectWrapper}>
//               <select value={selectedBodyType} onChange={(e) => setSelectedBodyType(e.target.value)} className={styles.select}>
//                 <option value="">Select Body Type</option>
//                 {bodyTypes?.bodyTypes?.map((b) => (
//                   <option key={b._id} value={b._id}>{b.name}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Colors */}
//             <div className={styles.selectWrapper}>
//               <select value={exteriorColor} onChange={(e) => setExteriorColor(e.target.value)} className={styles.select}>
//                 <option value="">Select Exterior Color</option>
//                 {colors?.colors?.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
//               </select>
//             </div>
//             <div className={styles.selectWrapper}>
//               <select value={interiorColor} onChange={(e) => setInteriorColor(e.target.value)} className={styles.select}>
//                 <option value="">Select Interior Color</option>
//                 {colors?.colors?.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
//               </select>
//             </div>

//             {/* Location */}
//             <div className={styles.selectWrapper}>
//               <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className={styles.input} />
//             </div>
//           </div>

//           {/* Doors, Transmission, Fuel */}
//           <div className={styles.grid}>
//             <div className={styles.selectWrapper}>
//               <select value={selectedDoors} onChange={(e) => setSelectedDoors(e.target.value)} className={styles.select}>
//                 <option value="">Select Doors</option>
//                 {doors?.doors?.map((d) => (<option key={d._id} value={d._id}>{d.doors}</option>))}
//               </select>
//             </div>

//             <div className={styles.selectWrapper}>
//               <select value={selectedTransmission} onChange={(e) => setSelectedTransmission(e.target.value)} className={styles.select}>
//                 <option value="">Select Transmission</option>
//                 {transmissions?.transmissions?.map((t) => (<option key={t._id} value={t._id}>{t.transmission}</option>))}
//               </select>
//             </div>

//             <div className={styles.selectWrapper}>
//               <select value={selectedFuelType} onChange={(e) => setSelectedFuelType(e.target.value)} className={styles.select}>
//                 <option value="">Select Fuel Type</option>
//                 {fuelTypes?.fuelTypes?.map((f) => (<option key={f._id} value={f._id}>{f.name}</option>))}
//               </select>
//             </div>
//           </div>

//           {/* Insurance, Warranty & Mileage */}
//           <div className={styles.grid}>
//             <div className={styles.selectWrapper}>
//               <select value={insurance} onChange={(e) => setInsurance(e.target.value)} className={styles.select}>
//                 <option value="">Car Insurance</option>
//                 <option value="Yes">Yes</option>
//                 <option value="No">No</option>
//               </select>
//             </div>
//             <div className={styles.selectWrapper}>
//               <select value={warranty} onChange={(e) => setWarranty(e.target.value)} className={styles.select}>
//                 <option value="">Warranty</option>
//                 <option value="Yes">Yes</option>
//                 <option value="No">No</option>
//               </select>
//             </div>
//             <div className={styles.selectWrapper}>
//               <input type="number" placeholder="Mileage" value={mileage} onChange={(e) => setMileage(e.target.value)} className={styles.input} />
//             </div>
//           </div>

//           {/* Title & Description */}
//           <div className={styles.formGroup}>
//             <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className={styles.input} />
//             <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className={`${styles.input} ${styles.textarea}`} rows={4} />
//           </div>

//           {/* Rent */}
//           <div className={styles.grid}>
//             <input type="number" placeholder="Rent per Day" value={rentPerDay} onChange={(e) => setRentPerDay(e.target.value)} className={styles.input} />
//             <input type="number" placeholder="Rent per Week" value={rentPerWeek} onChange={(e) => setRentPerWeek(e.target.value)} className={styles.input} />
//             <input type="number" placeholder="Rent per Month" value={rentPerMonth} onChange={(e) => setRentPerMonth(e.target.value)} className={styles.input} />
//           </div>

//           {/* Technical Features */}
//           {techFeatures?.features?.map((f) => (
//             <label key={f._id} className={styles.featureBox}>
//               <input
//                 type="checkbox"
//                 checked={selectedTechFeatures.includes(f._id)}
//                 onChange={() => handleTechFeatureChange(f._id)}
//               />
//               <span>{f.name}</span>
//             </label>
//           ))}

//           {/* Other Features */}
//           {otherFeatures?.features?.map((f) => (
//             <label key={f._id} className={styles.featureBox}>
//               <input
//                 type="checkbox"
//                 checked={selectedOtherFeatures.includes(f._id)}
//                 onChange={() => handleOtherFeatureChange(f._id)}
//               />
//               <span>{f.name}</span>
//             </label>
//           ))}

//           {/* Images */}
//           <div className={styles.imageUploadSection}>
//             <input type="file" id="file-upload" onChange={handleImageChange} hidden multiple />
//             <label htmlFor="file-upload" className={`${styles.uploadLabel} ${styles.button}`}>Choose Files</label>
//             {images.length > 0 && (
//               <button type="button" onClick={() => setShowImages(!showImages)} className={`${styles.toggleButton} ${styles.button}`}>
//                 {showImages ? "Hide Images" : "Show Images"}
//               </button>
//             )}
//             {showImages && (
//               <div className={styles.imagePreviewGrid}>
//                 {images.map((img, idx) => (
//                   <img key={idx} src={img.url} alt={img.name} className={styles.imagePreview} />
//                 ))}
//               </div>
//             )}
//           </div>

//           <div style={{ textAlign: "right", marginTop: "20px" }}>
//             <button className={styles.button} type="submit" disabled={isLoading}>
//               {isLoading ? "Saving..." : "Save Car"}
//             </button>
//           </div>
//         </form>
//       </main>
//     </div>
//   );
// };

// export default
