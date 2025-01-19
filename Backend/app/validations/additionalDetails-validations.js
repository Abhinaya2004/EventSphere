export const additionalDetailsValidationSchema = {
    userId: {
      exists: {
        errorMessage: "User ID must be present",
      },
      notEmpty: {
        errorMessage: "User ID cannot be empty",
      },
      isMongoId: {
        errorMessage: "Invalid User ID",
      },
    },
    organizationName: {
      exists: {
        errorMessage: "Organization name must be present",
      },
      notEmpty: {
        errorMessage: "Organization name cannot be empty",
      },
      isLength: {
        options: { min: 3 },
        errorMessage: "Organization name must be at least 3 characters long",
      },
      trim: true,
    },
    panCardNumber: {
      exists: {
        errorMessage: "PAN card number must be present",
      },
      notEmpty: {
        errorMessage: "PAN card number cannot be empty",
      },
      matches: {
        options: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        errorMessage: "Invalid PAN card number format",
      },
      trim: true,
    },
    organizationAddress: {
      exists: {
        errorMessage: "Organization address must be present",
      },
      notEmpty: {
        errorMessage: "Organization address cannot be empty",
      },
      isLength: {
        options: { min: 10 },
        errorMessage: "Organization address must be at least 10 characters long",
      },
      trim: true,
    },
    contactDetails: {
      name: {
        exists: {
          errorMessage: "Contact person name must be present",
        },
        notEmpty: {
          errorMessage: "Contact person name cannot be empty",
        },
        isLength: {
          options: { min: 3 },
          errorMessage: "Contact person name must be at least 3 characters long",
        },
        trim: true,
      },
      email: {
        exists: {
          errorMessage: "Contact email must be present",
        },
        notEmpty: {
          errorMessage: "Contact email cannot be empty",
        },
        isEmail: {
          errorMessage: "Contact email is not valid",
        },
        trim: true,
        normalizeEmail: true,
      },
      phone: {
        exists: {
          errorMessage: "Contact phone number must be present",
        },
        notEmpty: {
          errorMessage: "Contact phone number cannot be empty",
        },
        matches: {
          options: /^[0-9]{10}$/,
          errorMessage: "Contact phone number must be 10 digits",
        },
        trim: true,
      },
    },
    bankDetails: {
      beneficiaryName: {
        exists: {
          errorMessage: "Beneficiary name must be present",
        },
        notEmpty: {
          errorMessage: "Beneficiary name cannot be empty",
        },
        trim: true,
      },
      accountType: {
        exists: {
          errorMessage: "Account type must be present",
        },
        notEmpty: {
          errorMessage: "Account type cannot be empty",
        },
        isIn: {
          options: [["Savings", "Current"]],
          errorMessage: "Account type must be either Savings or Current",
        },
        trim: true,
      },
      accountNumber: {
        exists: {
          errorMessage: "Account number must be present",
        },
        notEmpty: {
          errorMessage: "Account number cannot be empty",
        },
        isLength: {
          options: { min: 9, max: 18 },
          errorMessage: "Account number must be between 9 and 18 digits",
        },
        isNumeric: {
          errorMessage: "Account number must contain only numbers",
        },
        trim: true,
      },
      bankName: {
        exists: {
          errorMessage: "Bank name must be present",
        },
        notEmpty: {
          errorMessage: "Bank name cannot be empty",
        },
        trim: true,
      },
      ifscCode: {
        exists: {
          errorMessage: "IFSC code must be present",
        },
        notEmpty: {
          errorMessage: "IFSC code cannot be empty",
        },
        matches: {
          options: /^[A-Z]{4}0[A-Z0-9]{6}$/,
          errorMessage: "Invalid IFSC code format",
        },
        trim: true,
      },
    },
    documents: {
      panCard: {
        exists: {
          errorMessage: "PAN card document must be uploaded",
        },
        notEmpty: {
          errorMessage: "PAN card document cannot be empty",
        },
        isURL: {
          errorMessage: "Invalid PAN card document URL",
        },
        trim: true,
      },
    },
};
  