import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetRegistration } from "@/app/slices/registrationSlice";
import { useRegisterMutation } from "@/app/api/authApi";
import { toaster } from "@/components/ui/toaster";
import styles from "./signup.module.css";

const pdfFileSchema = (fieldName) =>
  z
    .any()
    .refine((files) => files && files.length > 0, `${fieldName} is required`)
    .refine(
      (files) =>
        Array.from(files).every((file) => file.type === "application/pdf"),
      "Only PDF files are allowed"
    );

// ✅ Zod schema for step 2
const schema = z.object({
  fleetSize: z
    .string()
    .refine((val) => Number(val) > 0, "Fleet size must be a positive number"),
  ijariCertificate: pdfFileSchema("Ijari Certificate"),
  tradeLicense: pdfFileSchema("Trade License"),
  vatCertificate: pdfFileSchema("Vat Certificate"),
  noc: pdfFileSchema("NOC"),
  emiratesId: pdfFileSchema("Emirates Id"),
  poa: pdfFileSchema("POA"),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms" }),
  }),
});

export default function DetailsForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const registration = useSelector((state) => state.registration);
  const [registerVendor, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // ✅ Flatten Step 1 fields
      formData.append("name", registration.name);
      formData.append("email", registration.email);
      formData.append("role", registration.role || "2");
      formData.append("businessName", registration.businessName);

      formData.append("city", registration.city); // ID
      formData.append("street", registration.street);
      formData.append("state", registration.state); // ID
      formData.append("country", registration.country); // ID
      formData.append("mapUrl", registration.mapUrl);

      formData.append("mobileNum", registration.mobileNum);
      formData.append("whatsappNum", registration.whatsappNum);
      formData.append("landlineNum", registration.landlineNum);

      // ✅ Step 2 fields
      formData.append("fleetSize", data.fleetSize);
      formData.append("ijariCertificate", data.ijariCertificate[0]);
      formData.append("tradeLicense", data.tradeLicense[0]);
      formData.append("vatCertificate", data.vatCertificate[0]);
      formData.append("noc", data.noc[0]);

      if (data.emiratesId?.[0])
        formData.append("emiratesId", data.emiratesId[0]);
      if (data.poa?.[0]) formData.append("poa", data.poa[0]);

      // ✅ API call with toaster
      await toaster.promise(registerVendor(formData).unwrap(), {
        loading: { title: "Registering...", description: "Please wait" },
        success: (res) => {
          dispatch(resetRegistration());
          navigate("/login");
          return {
            title: res?.message || "Registration successful!",
            description: " ",
          };
        },
        error: (err) => {
          return {
            title: err?.data?.message || "Registration failed",
            description: "Please try again",
          };
        },
      });
    } catch (err) {
      console.error("Register Error:", err);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.stepsHeader}>
          <div className={styles.step}>
            <span>1</span>
            <p>Basic Info</p>
          </div>
          <div className={styles.line}></div>
          <div className={`${styles.step} ${styles.active}`}>
            <span>2</span>
            <p>Details</p>
          </div>
        </div>

        <h2 className={styles.heading}>Details</h2>
        <p className={styles.signupSubtitle}>
          Provide your fleet and document details
        </p>

        <form className={styles.grid} onSubmit={handleSubmit(onSubmit)}>
          {/* Fleet Size */}
          <div className={styles.flexRow}>
            <div className={styles.halfInput}>
              <label className={styles.label}>Fleet Size *</label>
              <input
                type="number"
                className={styles.input}
                {...register("fleetSize")}
                placeholder="e.g. 50"
              />
              {errors.fleetSize && (
                <p className={styles.error}>{errors.fleetSize.message}</p>
              )}
            </div>
          </div>

          {/* File Uploads */}
          {/* File Uploads in Flex Rows */}
          <div className={styles.flexRow}>
            <div className={styles.halfInput}>
              <label className={styles.label}>Ejari Certificate *</label>
              <input
                type="file"
                className={styles.input}
                {...register("ijariCertificate")}
              />
              {errors.ijariCertificate && (
                <p className={styles.error}>
                  {errors.ijariCertificate.message}
                </p>
              )}
            </div>

            <div className={styles.halfInput}>
              <label className={styles.label}>Trade License *</label>
              <input
                type="file"
                className={styles.input}
                {...register("tradeLicense")}
              />
              {errors.tradeLicense && (
                <p className={styles.error}>{errors.tradeLicense.message}</p>
              )}
            </div>
          </div>

          <div className={styles.flexRow}>
            <div className={styles.halfInput}>
              <label className={styles.label}>VAT Certificate *</label>
              <input
                type="file"
                className={styles.input}
                {...register("vatCertificate")}
              />
              {errors.vatCertificate && (
                <p className={styles.error}>{errors.vatCertificate.message}</p>
              )}
            </div>

            <div className={styles.halfInput}>
              <label className={styles.label}>NOC *</label>
              <input
                type="file"
                className={styles.input}
                {...register("noc")}
              />
              {errors.noc && (
                <p className={styles.error}>{errors.noc.message}</p>
              )}
            </div>
          </div>

          <div className={styles.flexRow}>
            <div className={styles.halfInput}>
              <label className={styles.label}>Emirates ID</label>
              <input
                type="file"
                className={styles.input}
                {...register("emiratesId")}
              />
              {errors.emiratesId && (
                <p className={styles.error}>{errors.emiratesId.message}</p>
              )}
            </div>

            <div className={styles.halfInput}>
              <label className={styles.label}>POA</label>
              <input
                type="file"
                className={styles.input}
                {...register("poa")}
              />
              {errors.poa && (
                <p className={styles.error}>{errors.poa.message}</p>
              )}
            </div>
          </div>

          {/* Terms */}
          <div className={styles.inputFull}>
            <label className={styles.label}>
              <input type="checkbox" {...register("termsAccepted")} /> I agree
              to the <a href="#">Terms of Service</a>
            </label>
            {errors.termsAccepted && (
              <p className={styles.error}>{errors.termsAccepted.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div
            className={styles.inputFull}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <button
              type="submit"
              className={styles.nextButton}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Sign up as Vendor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
