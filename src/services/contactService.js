const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.handleIdentity = async (email, phoneNumber) => {
  const existingContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { email: email || undefined },
        { phoneNumber: phoneNumber || undefined }
      ]
    },
    orderBy: { createdAt: 'asc' }
  });

  let primaryContact = null;
  let allRelatedContacts = [...existingContacts];

  if (existingContacts.length === 0) {
    const newContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: 'primary'
      }
    });

    return formatResponse(newContact, [newContact]);
  }

  primaryContact = existingContacts.find(c => c.linkPrecedence === 'primary') || existingContacts[0];

  const linkedContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { linkedId: primaryContact.id },
        { id: primaryContact.id }
      ]
    }
  });

  allRelatedContacts = linkedContacts;

  const emailExists = allRelatedContacts.some(c => c.email === email);
  const phoneExists = allRelatedContacts.some(c => c.phoneNumber === phoneNumber);

  if (!emailExists || !phoneExists) {
    await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: 'secondary',
        linkedId: primaryContact.id
      }
    });
  }

  const finalContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { id: primaryContact.id },
        { linkedId: primaryContact.id }
      ]
    }
  });

  return formatResponse(primaryContact, finalContacts);
};

function formatResponse(primary, contacts) {
  const emails = Array.from(new Set(contacts.map(c => c.email).filter(Boolean)));
  const phoneNumbers = Array.from(new Set(contacts.map(c => c.phoneNumber).filter(Boolean)));
  const secondaryIds = contacts
    .filter(c => c.id !== primary.id)
    .map(c => c.id);

  return {
    contact: {
      primaryContactId: primary.id,
      emails,
      phoneNumbers,
      secondaryContactIds: secondaryIds
    }
  };
}
