const contactService = require('../services/contactService');

exports.identify = async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      return res.status(400).json({ error: 'Email or phoneNumber is required' });
    }

    const response = await contactService.handleIdentity(email, phoneNumber);
    return res.status(200).json(response);
  } catch (err) {
    console.error("Covert error:", err.message);
    res.status(500).json({ error: 'Unexpected issue in time-space continuum.' });
  }
};
