export const eventValidationSchema = {
    eventName: {
      exists: {
        errorMessage: "Event name must be provided",
      },
      notEmpty: {
        errorMessage: "Event name cannot be empty",
      },
      trim: true,
    },
    description: {
      exists: {
        errorMessage: "Description must be provided",
      },
      notEmpty: {
        errorMessage: "Description cannot be empty",
      },
      trim: true,
    },
    date: {
      exists: {
        errorMessage: "Event date must be provided",
      },
      isISO8601: {
        errorMessage: "Invalid date format. Use YYYY-MM-DD",
      },
      trim: true,
    },
    startTime: {
      exists: {
        errorMessage: "Start time must be provided",
      },
      matches: {
        options: [/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/], // 24-hour HH:mm format
        errorMessage: "Invalid start time format (HH:mm)",
      },
    },
    endTime: {
      exists: {
        errorMessage: "End time must be provided",
      },
      matches: {
        options: [/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/], // 24-hour HH:mm format
        errorMessage: "Invalid end time format (HH:mm)",
      },
    },
    mode: {
      exists: {
        errorMessage: "Event mode must be specified",
      },
      isIn: {
        options: [["Online", "Offline"]],
        errorMessage: "Mode must be either 'Online' or 'Offline'",
      },
    },
    type: {
      exists: {
        errorMessage: "Event type must be specified",
      },
      notEmpty: {
        errorMessage: "Event type cannot be empty",
      },
      trim: true,
    },
    venue: {
      optional: true,
      custom: {
        options: (value, { req }) => {
          if (req.body.mode === "Offline" && !value && !req.body.customAddress) {
            throw new Error("Please provide either a venue or a custom address for Offline events.");
          }
          return true;
        },
      },
      
      custom: {
        options: (value, { req }) => {
          if (req.body.mode === "Offline" && value && !/^[0-9a-fA-F]{24}$/.test(value)) {
            throw new Error("Invalid venue ID");
          }
          return true;
        },
      },
    },
    customAddress: {
      optional: true,
      trim: true,
      custom: {
        options: (value, { req }) => {
          if (req.body.mode === "Offline" && !req.body.venue && (!value || value.trim().length < 5)) {
            throw new Error("Custom address must be at least 5 characters long for Offline events.");
          }
          return true;
        },
      },
    },
  
    // 🔹 Streaming Link validation (only if mode is Online)
    streamingLink: {
      optional: true,
      custom: {
        options: (value, { req }) => {
          if (req.body.mode === "Online" && (!value || !/^https?:\/\/.+/i.test(value))) {
            throw new Error("A valid streaming link is required for Online events.");
          }
          return true;
        },
      },
    },
  
    ticketTypes: {
      custom: {
        options: (value, { req }) => {
          // Parse ticketTypes if it's a string
          if (typeof value === "string") {
            try {
              value = JSON.parse(value);
            } catch (error) {
              throw new Error("Invalid ticketTypes format. Must be a valid JSON array.");
            }
          }
    
          if (!Array.isArray(value) || value.length === 0) {
            throw new Error("Ticket types must be a non-empty array.");
          }
    
          value.forEach((ticket) => {
            if (!ticket.name || typeof ticket.name !== "string") {
              throw new Error("Each ticket type must have a valid name.");
            }
            if (!ticket.price || isNaN(ticket.price) || ticket.price <= 0) {
              throw new Error("Each ticket type must have a valid positive price.");
            }
            if (!ticket.availableQuantity || isNaN(ticket.availableQuantity) || ticket.availableQuantity <= 0) {
              throw new Error("Each ticket type must have a valid positive quantity.");
            }
          });
    
          return true;
        },
      },
    },
    
    images: {
      optional: true,
      isArray: {
        errorMessage: "Images must be an array",
      },
      custom: {
        options: (images) => {
          images.forEach((url) => {
            if (typeof url !== "string" || !url.startsWith("http")) {
              throw new Error("Each image must be a valid URL");
            }
          });
          return true;
        },
      },
    },
    status: {
      optional: true,
      isIn: {
        options: [["Upcoming", "Ongoing", "Completed", "Cancelled"]],
        errorMessage: "Invalid status",
      },
    },
  };