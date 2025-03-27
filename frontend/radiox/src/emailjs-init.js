// This file contains instructions for setting up EmailJS for appointment confirmations

/*
To create your own EmailJS account and set up a template:

1. Go to https://www.emailjs.com/ and sign up for a free account

2. Create a new Email Service (e.g., Gmail, Outlook, etc.)
   - Click "Add New Service"
   - Choose your email provider and connect your account

3. Create a new Email Template:
   - Click "Email Templates" in the sidebar
   - Click "Create New Template"
   - Give it a name like "appointment_confirmation"
   
4. Use this sample template:

Subject: Appointment Confirmation - RadioX Medical Center

Hello {{to_name}},

Thank you for booking your appointment with RadioX Medical Center.

Appointment Details:
Service: {{service_name}}
Date: {{appointment_date}}
Time: {{appointment_time}}
Location: {{appointment_location}}
Doctor: {{doctor_name}}

Your appointment has been confirmed. Your confirmation number is: {{appointment_id}}
The total amount charged was: {{total_amount}}

If you need to reschedule or cancel, please contact us at least 24 hours before your appointment.

For any questions, please call us at (555) 123-4567 or reply to this email.

Thank you for choosing RadioX Medical Center for your healthcare needs.

Best regards,
The RadioX Team

5. Update the EmailJS configuration in the PaymentDialog component:
   - Use your own Service ID
   - Use your own Template ID
   - Use your own Public Key
*/

// Example configuration:
// const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID"; 
// const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"; 
// const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY"; 

console.log("See instructions for setting up EmailJS in this file"); 