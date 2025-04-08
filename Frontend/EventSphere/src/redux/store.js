import { configureStore } from "@reduxjs/toolkit";
import venuesReducer from './Slice/venuesSlice'
import eventsReducer from './Slice/eventSlice'

export const store = configureStore({
  reducer: {
    venues: venuesReducer, // Register venues slice
    events: eventsReducer
  },
});

export default store;