import { useEffect, useRef, useState } from "react";
import styles from "./VendorProfile.module.css";
import DocumentCard from "./DocumentCard";
import { Box, Flex } from "@chakra-ui/react";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/app/api/profileApi";
import profilePicPlaceholder from "@/assets/images/avatar.svg";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PenBox } from "lucide-react";
import { toaster } from "@/components/ui/toaster";
import { zodResolver } from "@hookform/resolvers/zod";
import { Skeleton, SkeletonCircle } from "@chakra-ui/react";
import DocumentCardSkeleton from "./DocumentCardSkeleton ";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  businessName: z.string("businessName must be a string"),
  street: z.string("Street must be a string"),
  mapUrl: z.string("MapUrl must be a string"),
  whatsappNum: z.string("WhatsApp number must be a string"),
  landlineNum: z.string("Landline number must be a string"),
  mobileNum: z.string("Mobile number must be a string"),
  fleetSize: z.coerce.number({
    required_error: "FleetSize is required",
    invalid_type_error: "FleetSize must be a number",
  }),
  ijariCertificate: z.any().optional(),
  tradeLicense: z.any().optional(),
  vatCertificate: z.any().optional(),
  noc: z.any().optional(),
  emiratesId: z.any().optional(),
  poa: z.any().optional(),
  profilePicture: z.any().optional(),
});

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { data: profileData, isFetching } = useGetProfileQuery({
    refetchOnMountOrArgChange: true,
    skip: false,
  });
  const [updateProfile] = useUpdateProfileMutation();
  const imageRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: profileData?.data?.name || "",
      email: profileData?.data?.email || "",
      businessName: profileData?.data?.businessName || "",
      street: profileData?.data?.address?.street || "",
      mapUrl: profileData?.data?.address?.mapUrl || "",
      whatsappNum: profileData?.data?.contact?.whatsappNum || "",
      landlineNum: profileData?.data?.contact?.landlineNum || "",
      mobileNum: profileData?.data?.contact?.mobileNum || "",
      fleetSize: profileData?.data?.vendorInformation?.fleetSize || "",
      profilePicture: profileData?.data?.profilePicture || null, // ✅ only once
      ijariCertificate: null,
      tradeLicense: null,
      vatCertificate: null,
      noc: null,
      emiratesId: null,
      poa: null,
    },
  });

  useEffect(() => {
    if (profileData) {
      reset({
        name: profileData?.data?.name || "",
        email: profileData?.data?.email || "",
        businessName: profileData?.data?.businessName || "",
        street: profileData?.data?.address?.street || "",
        mapUrl: profileData?.data?.address?.mapUrl || "",
        whatsappNum: profileData?.data?.contact?.whatsappNum || "",
        landlineNum: profileData?.data?.contact?.landlineNum || "",
        mobileNum: profileData?.data?.contact?.mobileNum || "",
        fleetSize: profileData?.data?.vendorInformation?.fleetSize || "",
        profilePicture: profileData?.data?.profilePicture || null, // ✅ only once
        ijariCertificate: null,
        tradeLicense: null,
        vatCertificate: null,
        noc: null,
        emiratesId: null,
        poa: null,
      });
    }
  }, [profileData, reset]);

  useEffect(() => {
    console.log("VendorProfile:errors", errors);
  }, [errors]);

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const onSubmit = async (data) => {
    console.log("VendorProfile:submittedData", data);
    const formData = new FormData();

    // ✅ Flatten Step 1 fields
    formData.append("name", data.name);
    formData.append("email", data.email);
    if (data.businessName) formData.append("businessName", data.businessName);

    if (data.street) formData.append("street", data.street);
    if (data.mapUrl) formData.append("mapUrl", data.mapUrl);

    if (data.mobileNum) formData.append("mobileNum", data.mobileNum);
    if (data.whatsappNum) formData.append("whatsappNum", data.whatsappNum);
    if (data.landlineNum) formData.append("landlineNum", data.landlineNum);

    // ✅ Step 2 fields
    if (data.fleetSize) formData.append("fleetSize", data.fleetSize);
    if (data.ijariCertificate?.[0])
      formData.append("ijariCertificate", data.ijariCertificate[0]);
    if (data.tradeLicense?.[0])
      formData.append("tradeLicense", data.tradeLicense[0]);
    if (data.vatCertificate?.[0])
      formData.append("vatCertificate", data.vatCertificate[0]);
    if (data.noc?.[0]) formData.append("noc", data.noc[0]);
    if (data.emiratesId?.[0]) formData.append("emiratesId", data.emiratesId[0]);
    if (data.poa?.[0]) formData.append("poa", data.poa[0]);
    if (data.profilePicture?.[0])
      formData.append("profilePicture", data.profilePicture[0]);

    toaster.promise(updateProfile(formData).unwrap(), {
      loading: { title: "Submitting", description: "Please wait..." },
      success: (res) => {
        toggleEdit();
        return {
          title: res?.message || "Profile updated successfully",
          description: "",
        };
      },
      error: (err) => {
        return {
          title: err?.data?.message || "Error updating profile",
          description: "",
        };
      },
    });
  };

  return (
    <Box p={{ base: 0, md: "20px" }}>
      <div className={styles.page}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className={`${styles.card} ${
              isEditing ? styles.editMode : styles.viewMode
            } max-w-[750px] md:min-w-[750px]`}
          >
            {/* Header */}
            <div className={styles.header}>
              <div
                className={`relative group overflow-hidden ${styles.avatar}`}
              >
                {isFetching ? (
                  <SkeletonCircle height="100%" width="100%" variant="shine" />
                ) : (
                  <img
                    src={
                      profileData?.data?.profilePicture
                        ? `${profileData.data.profilePicture}?t=${Date.now()}`
                        : profilePicPlaceholder
                    }
                    alt="Profile"
                    className={`h-full w-full ${styles.avatarPhoto}`}
                  />
                )}
                {isEditing && (
                  <Box
                    justify="center"
                    alignItems="center"
                    className="opacity-0 group-hover:opacity-100 transition cursor-pointer flex justify-center items-center h-[30%] w-full bg-[#202020c4] absolute bottom-0"
                    onClick={() => imageRef.current?.click()}
                  >
                    <PenBox color="#fff" size="15px" />
                  </Box>
                )}
                <input
                  type="file"
                  {...register("profilePicture")}
                  ref={(e) => {
                    register("profilePicture").ref(e); // connect to react-hook-form
                    imageRef.current = e; // keep your own ref
                  }}
                  className="hidden"
                />
              </div>

              <div className={`styles.headerText`}>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      {...register("name")}
                      className={`${styles.inputEdit} block !w-[350px]`}
                    />
                    <div className="text-red-600">{errors?.name?.message}</div>
                    <input
                      type="email"
                      {...register("email")}
                      className={`${styles.inputEdit} block !w-[350px]`}
                    />
                    <div className="text-red-600">{errors?.email?.message}</div>
                  </>
                ) : (
                  <>
                    {isFetching ? (
                      <Skeleton variant="shine" width="200px" height="15px" />
                    ) : (
                      <h2 className={styles.name}>{profileData?.data?.name}</h2>
                    )}
                    {isFetching ? (
                      <Skeleton
                        variant="shine"
                        width="200px"
                        height="15px"
                        mt="10px"
                      />
                    ) : (
                      <p className={styles.infoItem}>
                        {profileData?.data?.email}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className={styles.section}>
              <h3>Basic Information</h3>
              <Box
                display={{ base: "block", md: "flex" }}
                className={`${styles.infoRow}`}
              >
                <Box
                  marginBottom={{ base: "20px" }}
                  className={styles.infoItem}
                >
                  <strong>Business Name</strong>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        {...register("businessName")}
                        className={styles.inputEdit}
                      />
                      <div className="text-red-600">
                        {errors?.businessName?.message}
                      </div>
                    </>
                  ) : isFetching ? (
                    <Skeleton
                      variant="shine"
                      width="200px"
                      height="15px"
                      mt="10px"
                    />
                  ) : (
                    profileData?.data?.businessName
                  )}
                </Box>

                <Box
                  marginBottom={{ base: "20px" }}
                  className={styles.infoItem}
                >
                  <strong>Fleet Size</strong>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        {...register("fleetSize")}
                        className={styles.inputEdit}
                      />
                      <div className="text-red-600">
                        {errors?.fleetSize?.message}
                      </div>
                    </>
                  ) : isFetching ? (
                    <Skeleton
                      variant="shine"
                      width="200px"
                      height="15px"
                      mt="10px"
                    />
                  ) : (
                    profileData?.data?.vendorInformation?.fleetSize
                  )}
                </Box>

                <Box
                  marginBottom={{ base: "20px" }}
                  className={styles.infoItem}
                >
                  <strong>Mobile Number</strong>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        {...register("mobileNum")}
                        className={styles.inputEdit}
                      />
                      <div className="text-red-600">
                        {errors?.mobileNum?.message}
                      </div>
                    </>
                  ) : isFetching ? (
                    <Skeleton
                      variant="shine"
                      width="200px"
                      height="15px"
                      mt="10px"
                    />
                  ) : (
                    profileData?.data?.contact?.mobileNum
                  )}
                </Box>

                <Box
                  marginBottom={{ base: "20px" }}
                  className={styles.infoItem}
                >
                  <strong>WhatsApp</strong>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        {...register("whatsappNum")}
                        className={styles.inputEdit}
                      />
                      <div className="text-red-600">
                        {errors?.whatsappNum?.message}
                      </div>
                    </>
                  ) : isFetching ? (
                    <Skeleton
                      variant="shine"
                      width="200px"
                      height="15px"
                      mt="10px"
                    />
                  ) : (
                    profileData?.data?.contact?.whatsappNum
                  )}
                </Box>

                <Box
                  marginBottom={{ base: "20px" }}
                  className={styles.infoItem}
                >
                  <strong>Landline</strong>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        {...register("landlineNum")}
                        className={styles.inputEdit}
                      />
                      <div className="text-red-600">
                        {errors?.landlineNum?.message}
                      </div>
                    </>
                  ) : isFetching ? (
                    <Skeleton
                      variant="shine"
                      width="200px"
                      height="15px"
                      mt="10px"
                    />
                  ) : (
                    profileData?.data?.contact?.landlineNum
                  )}
                </Box>
              </Box>
            </div>

            {/* Address */}
            <div className={styles.section}>
              <h3>Address</h3>
              <Box
                display={{ base: "block", md: "flex" }}
                className={styles.infoRow}
              >
                {Object.entries(profileData?.data?.address ?? {}).map(
                  ([field, value]) => {
                    if (["mapUrl", "street"].includes(field)) {
                      return (
                        <Box
                          marginBottom={{ base: "20px" }}
                          className={styles.infoItem}
                          key={field}
                        >
                          <strong>
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </strong>
                          {isEditing ? (
                            <input
                              type="text"
                              {...register(field)}
                              className={`${styles.inputEdit} ${
                                !["mapUrl", "street"].includes(field)
                                  ? "bg-[#00000023]"
                                  : "bg-[transparent]"
                              }`}
                              readOnly={!["mapUrl", "street"].includes(field)}
                            />
                          ) : field === "mapUrl" ? (
                            <a
                              href={`https://${value}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Map
                            </a>
                          ) : isFetching ? (
                            <Skeleton
                              variant="shine"
                              width="200px"
                              height="15px"
                              mt="10px"
                            />
                          ) : (
                            value
                          )}
                        </Box>
                      );
                    }
                    return null;
                  }
                )}
              </Box>
            </div>

            {/* Documents */}
            {!isEditing && (
              <div className={styles.section}>
                <h3>Vendor Documents</h3>
                <Flex
                  className={`${styles.infoRow}`}
                  justify={{ base: "center", md: "space-between" }}
                  flexWrap="wrap"
                  gap="20px"
                  mt="30px"
                >
                  {!isEditing
                    ? isFetching
                      ? Array.from({ length: 6 }).map((_, i) => (
                          <DocumentCardSkeleton key={i} />
                        ))
                      : Object.entries(
                          profileData?.data?.vendorInformation?.documents ?? {}
                        ).map(([key, value], index) => (
                          <DocumentCard key={index} doc={{ key, value }} />
                        ))
                    : // <>
                      //   <div className={styles.infoItem}>
                      //     <strong>Ijari Certificate</strong>
                      //     <input
                      //       type="file"
                      //       {...register("ijariCertificate")}
                      //       className={styles.inputEdit}
                      //     />
                      //   </div>

                      //   <div className={styles.infoItem}>
                      //     <strong>Trade License</strong>
                      //     <input
                      //       type="file"
                      //       {...register("tradeLicense")}
                      //       className={styles.inputEdit}
                      //     />
                      //   </div>

                      //   <div className={styles.infoItem}>
                      //     <strong>Vat Certificate</strong>
                      //     <input
                      //       type="file"
                      //       {...register("vatCertificate")}
                      //       className={styles.inputEdit}
                      //     />
                      //   </div>

                      //   <div className={styles.infoItem}>
                      //     <strong>NOC</strong>
                      //     <input
                      //       type="file"
                      //       {...register("noc")}
                      //       className={styles.inputEdit}
                      //     />
                      //   </div>

                      //   <div className={styles.infoItem}>
                      //     <strong>Emirates ID</strong>
                      //     <input
                      //       type="file"
                      //       {...register("emiratesId")}
                      //       className={styles.inputEdit}
                      //     />
                      //   </div>

                      //   <div className={styles.infoItem}>
                      //     <strong>POA</strong>
                      //     <input
                      //       type="file"
                      //       {...register("poa")}
                      //       className={styles.inputEdit}
                      //     />
                      //   </div>
                      // </>
                      null}
                </Flex>
              </div>
            )}

            <Flex justify={{ base: "center", md: "flex-end" }} mt="20px">
              {!isEditing ? (
                <div
                  className={`${styles.editBtn} ${styles.editModeBtn} cursor-pointer text-center sm:!w-full md:!w-auto`}
                  onClick={toggleEdit}
                >
                  Edit
                </div>
              ) : (
                <button
                  type="submit"
                  className={`${styles.editBtn} ${styles.saveBtn} sm:!w-full md:!w-auto`}
                >
                  Save
                </button>
              )}
            </Flex>
          </div>
        </form>
      </div>
    </Box>
  );
};

export default Profile;
