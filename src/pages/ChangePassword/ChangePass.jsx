"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import styles from "./changepass.module.css";
import { useChangePasswordMutation } from "@/app/api/authApi";
import { toaster } from "@/components/ui/toaster";

// ✅ Zod schema
const schema = z
  .object({
    email: z.string().email("Enter a valid email address"),
    oldPassword: z
      .string()
      .min(6, "Old password must be at least 6 characters"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const ChangePass = () => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const navigate = useNavigate();

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    console.log("Form Data Submitted:", data);
    toaster.promise(
      changePassword({
        email: data.email,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }).unwrap(),
      {
        loading: { title: "Changing Password...", description: "Please wait" },
        success: (res) => {
          console.log("Changepass response:", res);

          const successMessage =
            res?.message || "Password changed successfully!";

          if (res?.code === 9012) {
            setTimeout(() => navigate("/login"), 500);
          }

          return {
            title: successMessage,
            description: "Please login with your new password.",
          };
        },
        error: (err) => {
          return {
            title: err?.data?.message || "Failed to change password.",
            description: "Please try again.",
          };
        },
      }
    );
  };

  return (
    <div className={styles.resetWrapper}>
      <div className={styles.resetCard}>
        <h3 className={styles.title}>Change Password</h3>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {/* Email */}
          <label className={styles.label}>Email</label>
          <input
            type="email"
            className={styles.inputField}
            style={{ marginBottom: "15px" }}
            placeholder="Enter your email"
            {...register("email")}
          />
          {errors.email && (
            <p className={styles.error}>{errors.email.message}</p>
          )}

          {/* Old Password */}
          <label className={styles.label}>Old Password</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showOld ? "text" : "password"}
              className={styles.inputField}
              placeholder="Enter old password"
              {...register("oldPassword")}
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowOld(!showOld)}
            >
              {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
          {errors.oldPassword && (
            <p className={styles.error}>{errors.oldPassword.message}</p>
          )}

          {/* New Password */}
          <label className={styles.label}>New Password</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showNew ? "text" : "password"}
              className={styles.inputField}
              placeholder="Enter new password"
              {...register("newPassword")}
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowNew(!showNew)}
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
          {errors.newPassword && (
            <p className={styles.error}>{errors.newPassword.message}</p>
          )}

          {/* Confirm Password */}
          <label className={styles.label}>Confirm Password</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showConfirm ? "text" : "password"}
              className={styles.inputField}
              placeholder="Confirm new password"
              {...register("confirmPassword")}
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className={styles.error}>{errors.confirmPassword.message}</p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitBtn}
            style={
              isSubmitting
                ? { backgroundColor: "#ccc", cursor: "not-allowed" }
                : {}
            }
          >
            {isSubmitting ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePass;
