export const venueValidationSchema = {
    venueName: {
      exists: {
        errorMessage: "Venue name must be present",
      },
      notEmpty: {
        errorMessage: "Venue name cannot be empty",
      },
      trim: true,
    },
    description: {
      exists: {
        errorMessage: "Description must be present",
      },
      notEmpty: {
        errorMessage: "Description cannot be empty",
      },
      trim: true,
    },
    address: {
      exists: {
        errorMessage: "Address must be present",
      },
      notEmpty: {
        errorMessage: "Address cannot be empty",
      },
      trim: true,
    },
    capacity: {
      exists: {
        errorMessage: "Capacity must be specified",
      },
      isInt: {
        options: { min: 1 },
        errorMessage: "Capacity must be a positive integer",
      },
      toInt: true, // Converts the value to an integer
    },
    "price.dailyRate": {
      exists: {
        errorMessage: "Daily rate must be specified",
      },
      isFloat: {
        options: { min: 0 },
        errorMessage: "Daily rate must be a valid positive number",
      },
      toFloat: true, // Converts the value to a float
    },
    "price.hourlyRate": {
      exists: {
        errorMessage: "Hourly rate must be specified",
      },
      isFloat: {
        options: { min: 0 },
        errorMessage: "Hourly rate must be a valid positive number",
      },
      toFloat: true, // Converts the value to a float
    },
    "price.minHourlyDuration": {
      optional: {
        options: { nullable: true },
      },
      isInt: {
        options: { min: 1 },
        errorMessage: "Minimum hourly duration must be a positive integer",
      },
      toInt: true, // Converts the value to an integer
      customSanitizer: {
        options: (value) => value ?? 1, // Default value is 1
      },
    },
    "price.maxHourlyDuration": {
      optional: {
        options: { nullable: true },
      },
      isInt: {
        options: { min: 1 },
        errorMessage: "Maximum hourly duration must be a positive integer",
      },
      toInt: true, // Converts the value to an integer
      customSanitizer: {
        options: (value) => value ?? 8, // Default value is 8
      },
    },
    amenities: {
      optional: {
        options: { nullable: true },
      },
      isArray: {
        errorMessage: "Amenities must be an array of strings",
      },
      custom: {
        options: (value) => {
          if (value && value.some((item) => typeof item !== "string")) {
            throw new Error("Each amenity must be a string");
          }
          return true;
        },
      },
    },
    "ownerContact.email": {
      exists: {
        errorMessage: "Owner email must be provided",
      },
      isEmail: {
        errorMessage: "Owner email must be a valid email address",
      },
      trim: true,
      normalizeEmail: true,
    },
    "ownerContact.phone": {
      exists: {
        errorMessage: "Owner phone number must be provided",
      },
      isMobilePhone: {
        errorMessage: "Owner phone number must be a valid phone number",
      },
    },
    documents: {
      optional: {
        options: { nullable: true },
      },
      isArray: {
        errorMessage: "Documents must be an array of strings (URLs)",
      },
      custom: {
        options: (value) => {
          if (value && value.some((item) => typeof item !== "string")) {
            throw new Error("Each document must be a valid string (URL)");
          }
          return true;
        },
      },
    },
    images: {
      optional: {
        options: { nullable: true },
      },
      isArray: {
        errorMessage: "Images must be an array of strings (URLs)",
      },
      custom: {
        options: (value) => {
          if (value && value.some((item) => typeof item !== "string")) {
            throw new Error("Each image must be a valid string (URL)");
          }
          return true;
        },
      },
    },
  };
  