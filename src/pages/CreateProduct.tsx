import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useWallet } from "@/context/WalletContext";
import {
  getFixedListingFee,
  listProduct,
  uploadProductImage,
} from "@/services/productService";
import { StatusType } from "@/types";
import { PageDescription, PageTitle } from "@/components/Core/Common";
import CreateProductForm from "@/components/CreateProduct/CreateProductForm";
import {
  errorHandler,
  getSelectedImage,
  readImage,
  validateProductImage,
  validation,
} from "@/utils";
import { Alert } from "@mui/material";
import { CreateProductFormData, CurrencyType } from "@/types/ui";

const CreateProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { connected, address, connect, getSigner } = useWallet();
  const [form, setForm] = useState<CreateProductFormData>({
    name: "",
    description: "",
    price: "",
    currency: CurrencyType.PHX,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageURI, setImageURI] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<StatusType>(StatusType.Idle);
  const [submitError, setSubmitError] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [fixedListingFee, setFixedListingFee] = useState<string | null>(null);
  const [listingFeeError, setListingFeeError] = useState("");
  const imageUploadVersion = useRef(0);

  useEffect(() => {
    let active = true;
    getFixedListingFee()
      .then((fee) => {
        if (active) setFixedListingFee(fee);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setListingFeeError(
          errorHandler(
            error,
            "Could not load the fixed listing fee from the marketplace.",
          ),
        );
      });

    return () => {
      active = false;
    };
  }, []);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = getSelectedImage(event);
    if (!file) {
      return;
    }

    const validationError = validateProductImage(file);
    if (validationError) {
      setErrors((previous) => ({ ...previous, image: validationError }));

      return;
    }

    const uploadVersion = ++imageUploadVersion.current;
    setErrors((previous) => ({ ...previous, image: "" }));
    setImagePreview(null);
    setImageURI(null);
    setUploadingImage(true);
    try {
      const preview = await readImage(file);
      if (uploadVersion !== imageUploadVersion.current) {
        return;
      }
      setImagePreview(preview);

      const uri = await uploadProductImage(file);
      if (uploadVersion === imageUploadVersion.current) {
        setImageURI(uri);
      }
    } catch (error) {
      if (uploadVersion === imageUploadVersion.current) {
        setErrors((previous) => ({
          ...previous,
          image: errorHandler(error, "Could not read or upload the image."),
        }));
      }
    } finally {
      if (uploadVersion === imageUploadVersion.current) {
        setUploadingImage(false);
      }
    }
  };

  const handleRemoveImage = () => {
    imageUploadVersion.current += 1;
    setImagePreview(null);
    setImageURI(null);
    setUploadingImage(false);
    setErrors((previous) => ({ ...previous, image: "" }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { validate, errs } = validation(form, imageURI);
    setErrors(errs);
    if (!validate) return;

    if (!connected || !address) {
      await connect();

      return;
    }

    setSubmitting(true);
    setSubmitStatus(StatusType.Pending);
    setSubmitError("");
    setTransactionHash("");

    try {
      if (!imageURI) throw new Error("Upload a product image to IPFS first.");
      const signer = await getSigner();
      const hash = await listProduct(
        {
          name: form.name.trim(),
          description: form.description.trim(),
          pricePHX: form.price.trim(),
          imageURI,
        },
        signer,
      );
      setTransactionHash(hash);
      setSubmitStatus(StatusType.Success);
    } catch (error) {
      setSubmitError(errorHandler(error, "Product listing failed."));
      setSubmitStatus(StatusType.Error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <PageTitle title="Create Listing" />
        <PageDescription
          description={`List a digital product on PHX Marketplace. Creating a product costs a
          fixed listing fee of ${fixedListingFee ?? "loading..."} PHX, regardless
          of the product price. Approve the fee in your wallet before confirming
          the listing transaction.`}
        />
        {listingFeeError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Could not load the current fixed listing fee: {listingFeeError}
          </Alert>
        )}
        <CreateProductForm
          form={form}
          setForm={setForm}
          errors={errors}
          imagePreview={imagePreview}
          imageURI={imageURI}
          uploadingImage={uploadingImage}
          submitting={submitting}
          connected={connected}
          submitStatus={submitStatus}
          submitError={submitError}
          transactionHash={transactionHash}
          onImageChange={handleImageChange}
          onRemoveImage={handleRemoveImage}
          onSubmit={(event) => void handleSubmit(event)}
          onCancel={() => navigate("/")}
        />
      </motion.div>
    </Box>
  );
};

export default CreateProductPage;
