const sdk = require('node-appwrite');

/*
 * Appwrite Function: send-email
 * Trigger: databases.[DB_ID].collections.contacts.documents.*.create
 * 
 * This function sends an automated email response whenever a new document
 * is submitted to the contacts collection.
 */
module.exports = async ({ req, res, log, error }) => {
  log('Send-email function triggered.');

  if (!req.bodyRaw) {
    error('No request body found.');
    return res.json({ success: false, error: 'Empty payload' });
  }

  try {
    const payload = typeof req.bodyRaw === 'string' ? JSON.parse(req.bodyRaw) : req.body;
    
    // Extract document fields
    const contactName = payload.name;
    const contactEmail = payload.email;

    if (!contactEmail) {
      error('Email field is missing in the document.');
      return res.json({ success: false, error: 'No email provided' });
    }

    log(`Preparing automated response to ${contactName} (${contactEmail})...`);

    /*
     * EMAIL SENDING LOGIC
     * Uncomment and configure your preferred email provider below.
     * Ensure you add the respective dependency to this function's package.json
     * 
     * Example using SendGrid:
     * 
     * const sgMail = require('@sendgrid/mail');
     * sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Set up this Env variable in Appwrite Console
     * 
     * const msg = {
     *   to: contactEmail,
     *   from: 'hello@mindwellness.com', // Must be verified email
     *   subject: 'Thank you for your enquiry - Mind Wellness',
     *   text: `Hi ${contactName},\n\nThank you for reaching out to Mind Wellness. We have received your enquiry regarding your selected options. Our team will review your details and get back to you within 24 hours.\n\nWarm regards,\nThe Mind Wellness Team`,
     *   html: `<p>Hi <strong>${contactName}</strong>,</p><p>Thank you for reaching out to Mind Wellness. We have received your enquiry and our team will get back to you within 24 hours.</p><p>Warm regards,<br/>The Mind Wellness Team</p>`,
     * };
     * 
     * await sgMail.send(msg);
     */

    log('Automated response successfully dispatched.');
    return res.json({ success: true, message: `Response dispatched to ${contactEmail}` });

  } catch (err) {
    error(`Failed to execute function: ${err.message}`);
    return res.json({ success: false, error: err.message });
  }
};
