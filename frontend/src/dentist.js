class Dentist {
    constructor(name, specialty, contact = 'https://meet.google.com/rnm-oyoe-azk') {
        this.name = name;
        this.specialty = specialty;
        this.contact = contact;
    }

    getDetails() {
        return `Name: ${this.name}\nSpecialty: ${this.specialty}\nContact: ${this.contact}`;
    }
}

export default Dentist;

