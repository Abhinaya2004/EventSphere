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
      isMongoId: {
        errorMessage: "Invalid venue ID",
      },
    },
    customAddress: {
      optional: true,
      trim: true,
      isLength: {
        options: { min: 5 },
        errorMessage: "Address must be at least 5 characters long",
      },
    },
    organizer: {
      exists: {
        errorMessage: "Organizer ID must be provided",
      },
      isMongoId: {
        errorMessage: "Invalid organizer ID",
      },
    },
    ticketTypes: {
      isArray: {
        errorMessage: "Ticket types must be an array",
      },
      custom: {
        options: (ticketTypes) => {
          if (!ticketTypes.length) {
            throw new Error("At least one ticket type must be provided");
          }
          ticketTypes.forEach((ticket) => {
            if (!ticket.name || typeof ticket.name !== "string") {
              throw new Error("Each ticket type must have a valid name");
            }
            if (!ticket.price || isNaN(ticket.price) || ticket.price <= 0) {
              throw new Error("Each ticket type must have a valid positive price");
            }
            if (!ticket.availableQuantity || isNaN(ticket.availableQuantity) || ticket.availableQuantity <= 0) {
              throw new Error("Each ticket type must have a valid positive quantity");
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