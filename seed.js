// seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product'); // adjust path

dotenv.config();

const seedProducts = [
  { name: "Tourist Visa Consultation", price: 99, category: "Visa Consultation", description : "Expert advice for tourist visa applications" },
  { name: "Student Visa Consultation", price: 120, category: "Visa Consultation", description : "Guidance for student visa applications" },
  { name: "Work Visa Consultation", price: 150, category: "Visa Consultation", description : "Assistance with work visa applications" },
  { name: "Family Visa Consultation", price: 130, category: "Visa Consultation", description : "Support for family visa applications" },
  
  { name: "Document Verification Service", price: 75, category: "Document Support", description : "Verification of required documents for visa applications" },
  { name: "Visa Application Form Review", price: 40, category: "Document Support", description : "Review of visa application forms for accuracy" },
  { name: "Form Filling Assistance", price: 59, category: "Document Support", description : "Help with filling out visa application forms" },
  { name: "Passport Renewal Service", price: 100, category: "Document Support", description : "Assistance with passport renewal applications" },
  
  { name: "Travel Itinerary Planning", price: 85, category: "Travel Insurance", description : "Customized travel itinerary planning service" },
  { name: "Flight Booking Assistance", price: 50, category: "Travel Insurance", description : "Help with booking flights for your trip" },
  { name: "Accommodation Booking Service", price: 60, category: "Travel Insurance", description : "Assistance with booking accommodations" },
  { name: "Comprehensive Travel Insurance", price: 180, category: "Travel Insurance" ,description : "Complete travel insurance coverage for your journey" },

  { name: "Emergency Visa Services", price: 200, category: "Priority Processing", description : "Fast-track services for urgent visa applications" },
  { name: "Same-Day Processing", price: 90, category: "Priority Processing",description : "Same-day processing for urgent visa needs" },
  { name: "Priority Document Handling", price: 110, category: "Priority Processing", description : "Expedited handling of visa documents" },
  { name: "Emergency Travel Assistance", price: 150, category: "Priority Processing", description : "24/7 assistance for travelers in emergencies" },
  
];

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log("MongoDB Connected");
  await Product.deleteMany(); // Clear old data
  await Product.insertMany(seedProducts);
  console.log("Seed data inserted!");
  process.exit();
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
