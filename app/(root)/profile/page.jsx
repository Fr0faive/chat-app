"use client";
import Loader from "@components/Loader";
import { PersonOutline } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { CldUploadButton } from "next-cloudinary";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
const ProfilePage = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        username: user?.username,
        profileImage: user?.profileImage,
      });
    }
    setLoading(false);
  }, [user]);

  const uploadPhoto = (result) => {
    setValue("profileImage", result?.info?.secure_url);
  };

  const updateUser = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user._id}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="profile-page">
      <h1 className="text-heading3-bold">Edit your profile</h1>
      <form className="edit-profile" onSubmit={handleSubmit(updateUser)}>
        <div className="input">
          <input
            {...register("username", {
              required: true,
              validate: (value) => {
                if (value.length < 3) {
                  return "Username must be at least 3 characters long";
                }
              },
            })}
            type="text"
            placeholder="Username"
            className="input-field"
          />
          <PersonOutline sx={{ color: "#737373" }} />
        </div>
        {errors.username && (
          <p className="text-red-1">{errors.username.message}</p>
        )}
        <div className="flex items-center justify-between">
          <img
            src={
              watch("profileImage") ||
              user?.profileImage ||
              "/assets/person.jpg"
            }
            alt="profile"
            className="w-40 h-40 rounded-full"
          />
          <CldUploadButton
            options={{ maxFiles: 1 }}
            onUpload={uploadPhoto}
            uploadPreset="a2q51uf9"
          >
            <p className="text-body-bold">Upload new photo</p>
          </CldUploadButton>
        </div>
        <button className="btn" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
