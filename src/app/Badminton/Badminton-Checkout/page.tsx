"use client";
import React from 'react'; 
import {
  Calendar,
  Clock,
  MapPin,
  Check,
  ArrowLeft,
} from 'lucide-react';
import { useRouter } from 'next/router';

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => ( 
  <div className="flex items-start justify-between py-4 border-b border-gray-200 last:border-b-0">
    <div className="flex items-center space-x-3">
      <div className="text-blue-600">{icon}</div>
      <span className="text-gray-600 font-medium">{label}</span>
    </div>
    <span className="text-gray-900 font-semibold text-right">{value}</span>
  </div>
);


export default function ConfirmBookingPage() {
  const courtNumber = '3';
  const rawDate = '2025-11-15';
  const timeSlot = '14:00 - 15:00';
  const router2 = useRouter();

  const router = {
    back: () => alert('Go Back clicked (demo)'),
    push: (path: string) => alert(`Redirecting to ${path} (demo)`),
  };
 
  let formattedDate = 'Invalid Date';
  let dayOfWeek = '';

  try {
    const bookingDate = new Date(rawDate);
    
    bookingDate.setMinutes(
      bookingDate.getMinutes() + bookingDate.getTimezoneOffset()
    );

    formattedDate = bookingDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    dayOfWeek = bookingDate.toLocaleDateString('en-US', {
      weekday: 'long',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
  }

 
  const handleConfirmBooking = async () => {
   
    console.log('Booking confirmation initiated...');

   
    const bookingData = {
      courtNumber,
      date: rawDate,
      timeSlot,
    
    };

    console.log('Booking Confirmed:', bookingData);
    alert('Booking Confirmed!\nSee console for details.');
   
  };

 
  const handleGoBack = () => {
    router2.push('/Badminton');
  };

  return (
    
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-inter">
     

      <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl w-full max-w-2xl relative">
        

        {/* Header */}
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
          Confirm Your Booking Details
        </h1>

        {/* Details Card */}
        <div className="bg-white rounded-lg space-y-2">
          <DetailItem
            icon={<MapPin size={20} />}
            label="Court Number"
            value={courtNumber}
          />
          <DetailItem
            icon={<Calendar size={20} />}
            label="Date & Day"
            value={`${formattedDate} (${dayOfWeek})`}
          />
          <DetailItem
            icon={<Clock size={20} />}
            label="Time Slot"
            value={timeSlot}
          />
        </div>

        {/* --- BUTTON CONTAINER --- */}
        
        <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          {/* Go Back Button */}
          <button
            onClick={handleGoBack}
            className="w-full sm:w-1/2 bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all duration-300 flex items-center justify-center space-x-2 text-lg"
          >
            <ArrowLeft size={22} />
            <span>Go Back</span>
          </button>

          {/* Confirmation Button */}
          <button
            onClick={handleConfirmBooking}
            className="w-full sm:w-1/2 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center space-x-2 text-lg"
          >
            <Check size={22} />
            <span>Confirm & Book</span>
          </button>
        </div>
      </div>
</div>
  );
}
    