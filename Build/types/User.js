"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(id, firstName, lastName, username, password, registeredAt) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
        this.registeredAt = registeredAt;
    }
    getID() {
        return this.id;
    }
    getFirstName() {
        return this.firstName;
    }
    getLastName() {
        return this.lastName;
    }
    getUsername() {
        return this.username;
    }
    getPassword() {
        return this.password;
    }
    getRegistedAt() {
        return this.registeredAt;
    }
}
exports.default = User;
