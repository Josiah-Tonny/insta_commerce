import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import Dropzone from "react-dropzone";
import { WithContext as ReactTagInput } from "react-tag-input";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "react-tag-input/example/reactTags.css";

// Cloudinary upload helper (replace with your Cloudinary config)
const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "YOUR_UPLOAD_PRESET";

const steps = [
  { label: "Basic Info" },
  { label: "Media" },
  { label: "Advanced" },
];

const validationSchemas = [
  // Step 1: Basic Info
  Yup.object({
    name: Yup.string().required("Product name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .typeError("Enter a valid price")
      .positive("Price must be positive")
      .required("Price is required"),
  }),
  // Step 2: Media
  Yup.object({
    images: Yup.array()
      .min(1, "At least 1 image required")
      .max(10, "Max 10 images allowed"),
  }),
  // Step 3: Advanced
  Yup.object({
    tags: Yup.array().of(Yup.string()),
    shipping: Yup.string().oneOf(["free", "paid"]),
  }),
];

const initialValues = {
  name: "",
  description: "",
  price: "",
  images: [],
  tags: [],
  shipping: "free",
};

export default function ProductForm() {
  const [step, setStep] = useState(0);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [uploading, setUploading] = useState(false);

  // Helper for Cloudinary upload
  const handleImageUpload = async (files, setFieldValue, values) => {
    setUploading(true);
    const uploads = files.slice(0, 10 - values.images.length).map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: "POST", body: formData });
      const data = await res.json();
      return data.secure_url;
    });
    const urls = await Promise.all(uploads);
    setFieldValue("images", [...values.images, ...urls]);
    setUploading(false);
  };

  // Tag input handlers
  const handleTagChange = (tags, setFieldValue) => {
    setFieldValue("tags", tags.map((t) => t.text));
  };

  // Responsive tab orientation
  const isMobile = window.innerWidth < 768;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6 relative">
        {/* Stepper/Sidebar */}
        <div className={`mb-6 ${isMobile ? "" : "absolute left-0 top-0 h-full flex flex-col justify-center"}`}>
          <div className={`flex ${isMobile ? "flex-row justify-between" : "flex-col gap-6"}`}>
            {steps.map((s, idx) => (
              <div
                key={s.label}
                className={`flex items-center cursor-pointer ${step === idx ? "font-bold text-instaPink" : "text-gray-400"}`}
                onClick={() => idx <= step && setStep(idx)}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step === idx
                      ? "bg-instaPink text-white border-instaPink"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {idx + 1}
                </div>
                <span className={`ml-2 ${isMobile ? "hidden" : "block"}`}>{s.label}</span>
                {idx < steps.length - 1 && (
                  <div className={`mx-2 ${isMobile ? "w-8 h-1" : "w-1 h-8"} bg-gray-200 rounded`} />
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Formik Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchemas[step]}
          validateOnChange
          validateOnBlur
          onSubmit={(values) => {
            if (step < steps.length - 1) {
              setStep(step + 1);
            } else {
              // Final submit
              alert("Product submitted!\n" + JSON.stringify(values, null, 2));
            }
          }}
        >
          {({ values, setFieldValue, errors, touched, isValid }) => (
            <Form className={`${isMobile ? "mt-8" : "ml-24"} flex flex-col gap-6`}>
              {/* Step 1: Basic Info */}
              {step === 0 && (
                <>
                  <div>
                    <label className="block font-semibold mb-1">Product Name</label>
                    <Field
                      name="name"
                      className={`form-input w-full rounded border ${
                        errors.name && touched.name ? "border-red-400" : "border-gray-300"
                      }`}
                      placeholder="Enter product name"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Description</label>
                    <Editor
                      editorState={editorState}
                      onEditorStateChange={(state) => {
                        setEditorState(state);
                        setFieldValue(
                          "description",
                          JSON.stringify(convertToRaw(state.getCurrentContent()))
                        );
                      }}
                      wrapperClassName="border rounded"
                      editorClassName="p-2 min-h-[120px]"
                      toolbarClassName="bg-gray-50"
                    />
                    {errors.description && touched.description && (
                      <div className="text-red-500 text-sm mt-1">Description is required</div>
                    )}
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Price ($)</label>
                    <Field
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      className={`form-input w-full rounded border ${
                        errors.price && touched.price ? "border-red-400" : "border-gray-300"
                      }`}
                      placeholder="e.g. 19.99"
                    />
                    <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </>
              )}
              {/* Step 2: Media */}
              {step === 1 && (
                <>
                  <div>
                    <label className="block font-semibold mb-2">Product Images</label>
                    <Dropzone
                      accept={{ "image/*": [] }}
                      multiple
                      maxFiles={10 - values.images.length}
                      onDrop={(acceptedFiles) =>
                        handleImageUpload(acceptedFiles, setFieldValue, values)
                      }
                      disabled={uploading || values.images.length >= 10}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div
                          {...getRootProps()}
                          className={`border-2 border-dashed rounded p-6 text-center cursor-pointer ${
                            uploading ? "opacity-60" : ""
                          }`}
                        >
                          <input {...getInputProps()} />
                          <span>
                            {uploading
                              ? "Uploading..."
                              : "Drag & drop images here, or click to select (max 10)"}
                          </span>
                        </div>
                      )}
                    </Dropzone>
                    {errors.images && touched.images && (
                      <div className="text-red-500 text-sm mt-1">{errors.images}</div>
                    )}
                  </div>
                  {/* Thumbnails */}
                  <div className="flex flex-wrap gap-3 mt-4">
                    {values.images.map((url, idx) => (
                      <div key={idx} className="relative w-20 h-20">
                        <img
                          src={url}
                          alt={`thumb-${idx}`}
                          className="w-20 h-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          onClick={() => {
                            setFieldValue(
                              "images",
                              values.images.filter((_, i) => i !== idx)
                            );
                          }}
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {/* Step 3: Advanced */}
              {step === 2 && (
                <>
                  <div>
                    <label className="block font-semibold mb-1">Tags</label>
                    <ReactTagInput
                      tags={values.tags.map((t) => ({ id: t, text: t }))}
                      handleDelete={(i) =>
                        setFieldValue(
                          "tags",
                          values.tags.filter((_, idx) => idx !== i)
                        )
                      }
                      handleAddition={(tag) =>
                        setFieldValue("tags", [...values.tags, tag.text])
                      }
                      delimiters={[188, 32]} // comma, space
                      placeholder="Add hashtags (e.g. #fashion)"
                      inputFieldPosition="bottom"
                      autocomplete
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Shipping Options</label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-2">
                        <Field type="radio" name="shipping" value="free" />
                        Free Shipping
                      </label>
                      <label className="flex items-center gap-2">
                        <Field type="radio" name="shipping" value="paid" />
                        Paid Shipping
                      </label>
                    </div>
                  </div>
                </>
              )}
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2 rounded font-semibold ${
                    isValid
                      ? "bg-instaPink text-white hover:bg-instaPurple"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!isValid || uploading}
                >
                  {step === steps.length - 1 ? "Submit" : "Next"}
                </button>
              </div>
            </Form>
          )}
         </Formik>
      </div>
    </div>
  );
}