const fs = require("fs/promises");
const res = require("express/lib/response");

const getContactFromJson = async () => {
    const data = await fs.readFile("./models/contacts.json");
    const contacts = await JSON.parse(data);
    return contacts;
};

const listContacts = async () => {
    const contacts = await getContactFromJson();
    console.table(contacts);
    return contacts;
};

const getContactById = async (contactId) => {
    const contacts = await getContactFromJson();
    const contact = contacts.find((contact) => {
        Number(contact.id) === Number(contactId);
    });

    console.table(contact);
    return contact;
};

const removeContact = async (contactId) => {
    const contacts = await getContactFromJson();
    const isContact = () => {
        contacts?.find((contact) => Number(contact.id) === Number(contactId));
    };

    if (!isContact()) return "Not found";

    await fs.writeFile(
        contactPath,
        JSON.stringify(
            contacts.filter(
                (contact) => Number(contact.id) !== Number(contactId)
            )
        )
    );

    return "Contact was deleted";
};

const addContact = async ({ name, email, phone }) => {
    const contacts = await getContactFromJson();
    const newContact = {
        id: String(contacts.length + 1),
        name,
        email,
        phone,
    };

    fs.writeFile(contactPath, JSON.stringify([...contacts, newContact]));

    console.table(newContact);
    return newContact;
};

const updateContact = async (contactId, body) => {
    const contacts = await getContactFromJson();
    let updatedContact;

    const isContact = () => {
        contacts.find((contact) => Number(contact.id) === Number(contactId));
    };

    if (!isContact()) return "Not found";

    fs.writeFile(
        contactPath,
        JSON.stringify(
            contacts.map((contact) => {
                if (contact.id === contactId) {
                    updatedContact = { ...contact, ...body };
                    return updatedContact;
                }
                return contact;
            })
        )
    );
    return updatedContact;
};

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
};
