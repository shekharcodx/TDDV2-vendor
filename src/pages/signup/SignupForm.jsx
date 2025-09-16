import React, { useEffect, useState } from "react";
import styles from "./signup.module.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateRegistrationField } from "@/app/slices/registrationSlice";

// import {
//   useGetCountriesQuery,
//   useLazyGetStatesQuery,
//   useLazyGetCitiesQuery,
// } from "@/app/api/locationApi";

// ✅ Zod schema
const schema = z.object({
  name: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  businessName: z.string().min(1, "Business name is required"),
  street: z.string().min(1, "Street is required"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  mapUrl: z.string().url("Enter a valid map URL"),
  landlineNum: z.string().min(6, "Landline must be at least 6 digits"),
  mobileNum: z.string().min(6, "Mobile number must be at least 6 digits"),
  whatsappNum: z.string().min(6, "WhatsApp number must be at least 6 digits"),
});

const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const { data: countries } = useGetCountriesQuery();
  // const [fetchStates, { data: states }] = useLazyGetStatesQuery();
  // const [fetchCities, { data: cities }] = useLazyGetCitiesQuery();

  const countries = ["UAE"];
  const states = ["Dubai", "Sharjah", "Abu Dhabi"];
  const cities = ["Dubai", "Sharjah", "Abu Dhabi"];

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    console.log("Form Errors:", errors);
  }, [errors]);

  const handleCountryChange = async (e) => {
    const countryId = e.target.value;
    setSelectedCountry(countryId);
    setValue("country", countryId);
    setSelectedState("");
    setValue("state", "");
    setValue("city", "");
    // if (countryId) await fetchStates(countryId);
  };

  const handleStateChange = async (e) => {
    const stateId = e.target.value;
    setSelectedState(stateId);
    setValue("state", stateId);
    setValue("city", "");
    // if (stateId) await fetchCities(stateId);
  };

  const handleCityChange = (e) => {
    setValue("city", e.target.value);
  };

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    dispatch(updateRegistrationField(data));
    navigate("/register-details");
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.stepsHeader}>
          <div className={`${styles.step} ${styles.active}`}>
            <span>1</span>
            <p>Basic Info</p>
          </div>
          <div className={styles.line}></div>
          <div className={styles.step}>
            <span>2</span>
            <p>Details</p>
          </div>
        </div>

        <h2 className={styles.heading}>Basic Info</h2>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.grid}>
          {/* Full Name */}
          <div>
            <label className={styles.label}>Full Name</label>
            <input
              {...register("name")}
              placeholder="Full Name"
              className={styles.input}
            />
            {errors?.name && (
              <p className={styles.error}>{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className={styles.label}>Email</label>
            <input
              {...register("email")}
              placeholder="Email"
              className={styles.input}
            />
            {errors?.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
          </div>

          {/* Business Name */}
          <div className={styles.inputFull}>
            <label className={styles.label}>Legal Business Name</label>
            <input
              {...register("businessName")}
              placeholder="Legal Business Name"
              className={styles.input}
            />
            {errors?.businessName && (
              <p className={styles.error}>{errors.businessName.message}</p>
            )}
          </div>

          {/* Street & Map URL side by side */}
          <div className={styles.flexRow}>
            <div className={styles.halfInput}>
              <label className={styles.label}>Street</label>
              <input
                {...register("street")}
                placeholder="Street"
                className={styles.input}
              />
              {errors?.street && (
                <p className={styles.error}>{errors.street.message}</p>
              )}
            </div>
            <div className={styles.halfInput}>
              <label className={styles.label}>Map URL</label>
              <input
                {...register("mapUrl")}
                placeholder="Map URL"
                className={styles.input}
              />
              {errors?.mapUrl && (
                <p className={styles.error}>{errors.mapUrl.message}</p>
              )}
            </div>
          </div>

          {/* Country */}
          <div>
            <label className={styles.label}>Country</label>
            <select
              {...register("country")}
              value={selectedCountry}
              onChange={handleCountryChange}
              className={styles.select}
            >
              <option value="">Select Country</option>
              {countries?.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors?.country && (
              <p className={styles.error}>{errors.country.message}</p>
            )}
          </div>

          {/* State */}
          <div>
            <label className={styles.label}>State</label>
            <select
              {...register("state")}
              value={selectedState}
              onChange={handleStateChange}
              className={styles.select}
              disabled={!states}
            >
              <option value="">Select State</option>
              {states?.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors?.state && (
              <p className={styles.error}>{errors.state.message}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label className={styles.label}>City</label>
            <select
              {...register("city")}
              onChange={handleCityChange}
              className={styles.select}
              disabled={!cities}
            >
              <option value="">Select City</option>
              {cities?.map((ct) => (
                <option key={ct} value={ct}>
                  {ct}
                </option>
              ))}
            </select>
            {errors?.city && (
              <p className={styles.error}>{errors.city.message}</p>
            )}
          </div>

          {/* Contact numbers in two-column layout */}
          {/* Contact Numbers in Two Columns */}
          <div className={styles.flexRow}>
            {["landlineNum", "mobileNum", "whatsappNum"].map((field) => (
              <div key={field} className={styles.halfInput}>
                <label className={styles.label}>
                  {field.replace("Num", " Number")}
                </label>
                <input
                  type="tel"
                  {...register(`${field}`)}
                  placeholder={`Enter ${field.replace("Num", " Number")}`}
                  className={styles.input}
                />
                {errors?.[field] && (
                  <p className={styles.error}>{errors[field].message}</p>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            className={styles.nextButton}
            disabled={!isValid}
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
