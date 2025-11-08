import { Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
export declare class Ping extends Model<InferAttributes<Ping>, InferCreationAttributes<Ping>> {
    id: CreationOptional<number>;
    userId: number;
    serverTimestamp: CreationOptional<Date>;
    userDeviceTimestamp: Date | null;
    endpointName: string | null;
    deviceName: string | null;
    deviceType: string | null;
    isTablet: boolean | null;
    manufacturer: string | null;
    modelName: string | null;
    osName: string | null;
    osVersion: string | null;
}
export declare function initPing(): typeof Ping;
