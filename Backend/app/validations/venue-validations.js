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
    price: {
      custom: {
        options: (value, { req }) => {
          try {
            // Parse `price` JSON string before accessing its properties
            const parsedPrice = JSON.parse(value);
            // console.log(parsedPrice)
  
            // Ensure `price` is an object
            if (typeof parsedPrice !== "object" || parsedPrice === null) {
              throw new Error("Invalid price format");
            }
  
            req.body.price = parsedPrice;// Save parsed object back to req.body
            req.body.price.dailyRate = parseInt(req.body.price.dailyRate)
            req.body.price.hourlyRate = parseInt(req.body.price.hourlyRate)
            console.log(typeof(req.body.price.dailyRate))
            return true;
          } catch (err) {
            throw new Error("Invalid price JSON format");
          }
        },
      },
    },

  "amenities": {
    optional: true,
    custom: {
      options: (value) => {
        if (typeof value === "string") {
          return value.split(",").map((item) => item.trim()); // Convert CSV string to array
        }
        return Array.isArray(value) ? value : []; // Ensure it’s always an array
      },
    },
  },
  "ownerContact": {
    optional: true,
    custom: {
      options: (value) => {
        if (typeof value === "string") {
          try {
            return JSON.parse(value); // Parse JSON string
          } catch {
            throw new Error("Invalid owner contact format");
          }
        }
        return value;
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
  