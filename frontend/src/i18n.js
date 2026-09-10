import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      brand_sub: "Sri Lanka's Next-Gen Bus Transit Network",
      hero_title: "Effortless Highway & Main Town Express Booking",
      hero_desc: "Board from any intermediate town • Automatic Stage Fares • Live Telemetry",
      one_way: "One-Way Journey",
      round_trip: "Round-Trip (Save 5%)",
      from_town: "Boarding Town / Interchange",
      to_town: "Dropping Town / Destination",
      search_btn: "Find Buses & Stage Fares",
      available_buses: "Available Highway & Corridor Buses",
      schedules_found: "Schedules Found",
      select_seats: "Select Seats",
      book_seats: "Select Your Preferred Seats",
      support: "Support",
      check_ticket: "Check Ticket",
      scanner: "Scanner",
      admin: "Admin",
      sign_in: "Sign In",
      sign_out: "Sign Out",
      step_outbound: "1. Outbound",
      step_return: "2. Return",
      double_checkout: "Double Checkout (Save 5%)",
      no_buses: "No active bus routes found connecting these towns."
    }
  },
  si: {
    translation: {
      brand_sub: "ශ්‍රී ලංකාවේ නවීනතම අධිවේගී බස් ප්‍රවේශපත්‍ර සේවාව",
      hero_title: "අධිවේගී සහ ප්‍රධාන නගර අතර පහසු බස් ආසන වෙන්කිරීම",
      hero_desc: "ඕනෑම අතරමඟ නගරයකින් ගොඩවීමේ පහසුව • නියමිත ගාස්තු • සජීවී බස් ස්ථාන",
      one_way: "තනි ගමන (One-Way)",
      round_trip: "යන එන දෙපැත්තම (5% වට්ටමක්)",
      from_town: "ගොඩවන නගරය / නැවතුම",
      to_town: "බසින නගරය / ගමනාන්තය",
      search_btn: "බස් රථ සහ ගාස්තු සොයන්න",
      available_buses: "ධාවනය වන අධිවේගී බස් රථ",
      schedules_found: "බස් රථ හමුවිය",
      select_seats: "ආසන තෝරන්න",
      book_seats: "ඔබ කැමති ආසන තෝරාගන්න",
      support: "සහාය",
      check_ticket: "ප්‍රවේශපත්‍රය",
      scanner: "ස්කෑනරය",
      admin: "පරිපාලක",
      sign_in: "ඇතුල් වන්න",
      sign_out: "ඉවත් වන්න",
      step_outbound: "1. යන ගමන",
      step_return: "2. එන ගමන",
      double_checkout: "දෙපැත්තම වෙන්කරන්න (5% ලාභයි)",
      no_buses: "මෙම නගර අතර ධාවනය වන බස් රථ හමු නොවීය."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;