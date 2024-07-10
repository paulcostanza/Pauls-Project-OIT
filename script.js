const fs = require('fs').promises;

// Function to read and parse a JSON file
const readJSONFile = async (filename) => {
    const data = await fs.readFile(filename, 'utf-8');
    return JSON.parse(data);
};

// Function to validate addresses and address types
const validateAddresses = async () => {
    const demographicsFile = 'student-demographics.json';
    const addressesFile = 'student-addresses.json';

    const studentDemographics = await readJSONFile(demographicsFile);
    const studentAddresses = await readJSONFile(addressesFile);

    const demographicsMap = new Map();
    studentDemographics.forEach(record => {
        demographicsMap.set(record.banner_id, record);
    });

    const addressMismatches = [];
    studentAddresses.forEach(record => {
        const demographicRecord = demographicsMap.get(record.banner_id);
        if (demographicRecord && demographicRecord.address !== record.address) {
            addressMismatches.push(record.banner_id);
        }
    });

    const invalidAddressTypes = studentDemographics
        .filter(record => !['PO', 'LO'].includes(record.address_type))
        .map(record => record.banner_id);

    if (addressMismatches.length > 0) {
        console.log(`Addresses do not match for the following banner_ids: ${addressMismatches.join(', ')}`);
    } else {
        console.log("All addresses match between the two files.");
    }

    if (invalidAddressTypes.length > 0) {
        console.log(`The following banner_ids have invalid address types: ${invalidAddressTypes.join(', ')}`);
    } else {
        console.log("All address types are valid (PO or LO).");
    }
};

validateAddresses().catch(console.error);
