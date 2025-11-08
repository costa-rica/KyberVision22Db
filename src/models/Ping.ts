import {
	DataTypes,
	Model,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	ForeignKey,
	literal,
} from "sequelize";
import { sequelize } from "./_connection";
// If you have a User model, you can import it and type the ForeignKey, e.g.:
// import { User } from "./User";

export class Ping extends Model<
	InferAttributes<Ping>,
	InferCreationAttributes<Ping>
> {
	declare id: CreationOptional<number>;

	// If you have a User model, you can type this as ForeignKey<User['id']>
	declare userId: number;

	// Stored in UTC. Highest precision supported by the dialect (microseconds on MySQL/Postgres).
	declare serverTimestamp: CreationOptional<Date>;

	// Client-provided UTC timestamp from the device, ideally an ISO string parsed to Date.
	declare userDeviceTimestamp: Date;

	// Endpoint name invoked when this ping was recorded.
	declare endpointName: string;

	// Device information fields
	declare deviceName: string;
	declare deviceType: string;
	declare isTablet: boolean;
	declare manufacturer: string;
	declare modelName: string;
	declare osName: string;
	declare osVersion: string;
}

export function initPing() {
	Ping.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},

			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},

			// Use DATE(6) where supported; SQLite will ignore precision but still store ms-level JS Date.
			serverTimestamp: {
				// ts-expect-error: precision is ignored on some dialects (e.g., sqlite) but safe to specify.
				type: (DataTypes.DATE as unknown as (precision?: number) => any)(6),
				allowNull: false,
				// Prefer DB-side UTC now. SQLite CURRENT_TIMESTAMP is UTC.
				defaultValue: literal("CURRENT_TIMESTAMP"),
			},

			userDeviceTimestamp: {
				// ts-expect-error: precision is ignored on some dialects (e.g., sqlite) but safe to specify.
				type: (DataTypes.DATE as unknown as (precision?: number) => any)(6),
				allowNull: false,
			},

			endpointName: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			deviceName: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			deviceType: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			isTablet: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},

			manufacturer: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			modelName: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			osName: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			osVersion: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: "pings",
			indexes: [{ fields: ["userId"] }, { fields: ["serverTimestamp"] }],
		}
	);

	return Ping;
}
