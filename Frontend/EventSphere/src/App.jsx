import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from './components/PrivateRoute.jsx';

import Navbar from './components/Navbar'

import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'

import ForgotPassword from './pages/Forgot-Password/ForgotPassword'
import VerifyOtp from './pages/Forgot-Password/VerifyOtp'
import ResetPassword from './pages/Forgot-Password/ResetPassword'
import AdditionalDetailsForm from './components/AdditionalDetailsForm'

import Dashboard from './pages/admin/Dashboard';
import VenueManagement from './pages/admin/VenueManagement';
import EventManagement from './pages/admin/EventManagement';
import UserManagement from './pages/admin/UserManagement';
import Transactions from './pages/admin/Transactions';
import AdditionalDetails from './pages/admin/AdditionalDetails';
import VenueDetails from './pages/admin/VenueDetails';
import EventDetails from './pages/admin/EventDetails';

import AddVenues from './pages/renter/AddVenues';
import MyVenues from './pages/renter/MyVenues';
import Messages from './pages/renter/Messages';
import Earnings from './pages/renter/Earnings';
import MyVenueDetails from './pages/renter/MyVenueDetails';
import VenuePayments from './pages/renter/VenuePayments';

import MyEvents from './pages/host/MyEvents';
import MyEventDetails from './pages/host/MyEventDetails';
import AddEvents from './pages/host/AddEvents';
import BookVenue from './pages/host/BookVenue';
import BookVenueDetails from './pages/host/BookVenueDetails';
import EventPayments from './pages/host/EventPayments';

import PaymentFailure from './components/PaymentFailure';
import PaymentSuccess from './components/PaymentSuccess';
import ProfilePage from './components/Profile';
import BookEvent from './pages/user/BookEvents';
import BookEventDetails from './pages/user/BookEventDetails';

import BookingList from './components/BookingList.jsx';

const App = () => {
  return (
    <div>
      <Navbar/>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected Routes */}
        <Route path='/Profile' element={
          <PrivateRoute>
            <ProfilePage/>
          </PrivateRoute>
        }/>
        
        <Route path="/additional-details" element={
          <PrivateRoute>
            <AdditionalDetailsForm />
          </PrivateRoute>
        } />
        
        <Route path="/verify-otp" element={
          <PrivateRoute>
            <VerifyOtp />
          </PrivateRoute>
        } />
        
        <Route path="/reset-password" element={
          <PrivateRoute>
            <ResetPassword />
          </PrivateRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/admin/venues" element={
          <PrivateRoute>
            <VenueManagement />
          </PrivateRoute>
        } />
        <Route path="/admin/events" element={
          <PrivateRoute>
            <EventManagement />
          </PrivateRoute>
        } />
        <Route path="/admin/users" element={
          <PrivateRoute>
            <UserManagement />
          </PrivateRoute>
        } />
        <Route path="/admin/transactions" element={
          <PrivateRoute>
            <Transactions />
          </PrivateRoute>
        } />
        <Route path="/admin/user-details/:userId" element={
          <PrivateRoute>
            <AdditionalDetails />
          </PrivateRoute>
        } />
        <Route path="/admin/venue-details/:venueId" element={
          <PrivateRoute>
            <VenueDetails />
          </PrivateRoute>
        } />
        <Route path="/admin/event-details/:eventId" element={
          <PrivateRoute>
            <EventDetails />
          </PrivateRoute>
        } />

        {/* Renter Routes */}
        <Route path="/renter/venues" element={
          <PrivateRoute>
            <MyVenues />
          </PrivateRoute>
        } />
        <Route path="/renter/add-venue" element={
          <PrivateRoute>
            <AddVenues />
          </PrivateRoute>
        } />
        <Route path="/renter/bookings" element={
          <PrivateRoute>
            <BookingList />
          </PrivateRoute>
        } />
        <Route path="/renter/messages" element={
          <PrivateRoute>
            <Messages />
          </PrivateRoute>
        } />
        <Route path="/renter/venue-details/:venueId" element={
          <PrivateRoute>
            <MyVenueDetails />
          </PrivateRoute>
        } />
        <Route path="/renter/earnings" element={
          <PrivateRoute>
            <Earnings />
          </PrivateRoute>
        } />
        <Route path="/renter/payments" element={
          <PrivateRoute>
            <VenuePayments />
          </PrivateRoute>
        } />

        {/* Host Routes */}
        <Route path="/host/events" element={
          <PrivateRoute>
            <MyEvents />
          </PrivateRoute>
        }/>
        <Route path="/host/event-details/:eventId" element={
          <PrivateRoute>
            <MyEventDetails />
          </PrivateRoute>
        } />
        <Route path="/host/create-event" element={
          <PrivateRoute>
            <AddEvents />
          </PrivateRoute>
        } />
        <Route path="/host/book-venue" element={
          <PrivateRoute>
            <BookVenue />
          </PrivateRoute>
        } />
        <Route path="/host/book-venue/:venueId" element={
          <PrivateRoute>
            <BookVenueDetails />
          </PrivateRoute>
        } />
        <Route path="/host/payments" element={
          <PrivateRoute>
            <EventPayments />
          </PrivateRoute>
        } />
        <Route path='/host/bookings' element={
          <PrivateRoute>
            <BookingList />
          </PrivateRoute>
        }/>

        {/* User Routes */}
        <Route path="/user/book-event" element={
          <PrivateRoute>
            <BookEvent />
          </PrivateRoute>
        } />
        <Route path="/user/book-event/:eventId" element={
          <PrivateRoute>
            <BookEventDetails />
          </PrivateRoute>
        } />

        {/* Payment Routes */}
        <Route path="/payment/cancel" element={<PaymentFailure />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
      </Routes>
    </div>
  )
}

export default App