"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ping = void 0;
exports.initPing = initPing;
const sequelize_1 = require("sequelize");
const _connection_1 = require("./_connection");
// If you have a User model, you can import it and type the ForeignKey, e.g.:
// import { User } from "./User";
class Ping extends sequelize_1.Model {
}
exports.Ping = Ping;
function initPing() {
    Ping.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        // Use DATE(6) where supported; SQLite will ignore precision but still store ms-level JS Date.
        serverTimestamp: {
            // ts-expect-error: precision is ignored on some dialects (e.g., sqlite) but safe to specify.
            type: sequelize_1.DataTypes.DATE(6),
            allowNull: false,
            // Prefer DB-side UTC now. SQLite CURRENT_TIMESTAMP is UTC.
            defaultValue: (0, sequelize_1.literal)("CURRENT_TIMESTAMP"),
        },
        userDeviceTimestamp: {
            // ts-expect-error: precision is ignored on some dialects (e.g., sqlite) but safe to specify.
            type: sequelize_1.DataTypes.DATE(6),
            allowNull: true,
        },
        endpointName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        deviceName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        deviceType: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        isTablet: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: true,
        },
        manufacturer: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        modelName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        osName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        osVersion: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
    }, {
        sequelize: _connection_1.sequelize,
        tableName: "pings",
        indexes: [{ fields: ["userId"] }, { fields: ["serverTimestamp"] }],
    });
    return Ping;
}
