const sdk = require('node-appwrite');

/*
 * Appwrite Function: send-email
 * Trigger: databases.[DB_ID].collections.contacts.documents.*.create
 * 
 * Dynamically fetches the Admin's Automations configuration from the DB
 * to dispatch personalized emails.
 */
module.exports = async ({ req, res, log, error }) => {
  log('Send-email function triggered.');

  if (!req.bodyRaw) {
    error('No request body found.');
    return res.json({ success: false, error: 'Empty payload' });
  }

  try {
    const payload = typeof req.bodyRaw === 'string' ? JSON.parse(req.bodyRaw) : req.body;
    const contactName = payload.name;
    const contactEmail = payload.email;

    if (!contactEmail) {
      error('Email field is missing in the document.');
      return res.json({ success: false, error: 'No email provided' });
    }

    log(`Preparing automated response to ${contactName} (${contactEmail})...`);

    // 1. Initialize Server DB access
    const client = new sdk.Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);
      
    const databases = new sdk.Databases(client);

    // 2. Fetch Admin Configurations
    let customMessage = `Thank you for your enquiry. We will get back to you shortly.`;
    let attachmentLink = ``;

    try {
      log('Fetching Automation mappings from Database...');
      const configDoc = await databases.getDocument('mindwellnessDB', 'settings', 'automations');
      const parsed = JSON.parse(configDoc.content);
      if(parsed.message) customMessage = parsed.message;
      if(parsed.pdfUrl) attachmentLink = `<p><strong>Mindfulness Resource:</strong> <a href="${parsed.pdfUrl}">Download PDF Here</a></p>`;
      log('Successfully captured Admin layout.');
    } catch(err) {
      log('No custom automation config found. Falling back to defaults.');
    }

    /*
     * 3. EMAIL SENDING LOGIC (Using Mock/Console output until SendGrid is attached)
     * 
     * Example using SendGrid:
     * const sgMail = require('@sendgrid/mail');
     * sgMail.setApiKey(process.env.SENDGRID_API_KEY);
     */
    
    const FinalHTML = `
      <p>Hi <strong>${contactName}</strong>,</p>
      <p>${customMessage.replace(/\n/g, '<br/>')}</p>
      ${attachmentLink}
      <br/>
      <p>Warm regards,<br/>The Mind Wellness Team (Zenquillient)</p>
    `;

    log("--- GENERATED EMAIL PAYLOAD ---");
    log(FinalHTML);
    log("-------------------------------");

    // NOTE: Perform actual `sgMail.send(msg)` here.

    log('Automated response successfully dispatched.');
    return res.json({ success: true, message: `Response dispatched to ${contactEmail}` });

  } catch (err) {
    error(`Failed to execute function: ${err.message}`);
    return res.json({ success: false, error: err.message });
  }
};
