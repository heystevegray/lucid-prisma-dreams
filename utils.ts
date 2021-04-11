import csv from 'csv-parser';
import { createReadStream, promises as fs } from 'fs';
import { exec } from 'child_process';
export const destinationFolder = './public/uploads';
export const inputFile = `data.csv`;
export const schemaFile = 'schema.prisma';

const results = [];
const SHAPE_LIBRARY = 'Shape Library';
const ENTITY_RELATIONSHIP = 'Entity Relationship';
const TABLE_NAME = 'Text Area 1';
const TEXT_AREA = 'Text Area';
const ID = 'id';
const outputFile = `${destinationFolder}/${schemaFile}`;

type LucidChart = {
	Id: number;
	Name: string;
	'Shape Library': string;
	'Page ID': string;
	'Contained By': string;
	Group: string;
	[TABLE_NAME]: string;
};

type LucidChartCSVRow = {
	tableName: string;
	relationShipType: string;
	columns: Column[];
};

type Column = {
	name: string;
	type: string;
};

const convertLucidToPrisma = (lucidRow: LucidChartCSVRow): string => {
	const { tableName, columns } = lucidRow;

	const fields = columns.map(({ name, type }) => {
		if (name === ID) {
			// Auto increment
			return `${name}\t${type}\t${`@id @default (autoincrement())`}\n`;
		}
		return `${name}\t${type}\t\n`;
	});

	const model = `model ${tableName} {\n\t${fields.join('\t')}}`;
	return model;
};

const generatePrismaSchema = async (schema: string[]) => {
	await fs.writeFile(outputFile, schema.join('\n\n'), 'utf8');
	console.log(`Successfully created ${outputFile}`);
};

const parseLucidChart = (): string[] => {
	const schema = [];
	for (let index = 0; index < results.length; index++) {
		const row = results[index] as LucidChart;
		const {
			Id,
			Name,
			[SHAPE_LIBRARY]: relationShipType,
			[TABLE_NAME]: tableName,
			...rest
		} = row;
		const entries = Object.entries(rest);
		const columns: Column[] = [];

		if (relationShipType === ENTITY_RELATIONSHIP) {
			const onlyColumns = entries.filter(([key]) => key.includes(TEXT_AREA));

			for (
				let columnIndex = 0;
				columnIndex < onlyColumns.length;
				columnIndex += 2
			) {
				const nextIndex = columnIndex + 1;
				if (columnIndex !== onlyColumns.length - 1) {
					const [, columnName] = onlyColumns[columnIndex];
					const [, dataType] = onlyColumns[nextIndex];
					const name = columnName as string;
					const type = dataType as string;
					if (name && type) {
						columns.push({ name, type });
					}
				}
			}

			const lucidRow: LucidChartCSVRow = {
				tableName,
				columns,
				relationShipType,
			};
			const model = convertLucidToPrisma(lucidRow);
			schema.push(model);
		}
	}
	return schema;
};

const format = (): void => {
	console.log(`Running prisma format 😎`);

	exec('npm run prisma:format', (error, stdout, stderr) => {
		if (error) {
			console.log(`${error.message}`);
			return;
		}
		if (stderr) {
			console.log(`${stderr}`);
			return;
		}
		console.log(`${stdout}`);
	});
};

export const lucidToPrisma = async (): Promise<void> => {
	createReadStream(`${destinationFolder}/${inputFile}`)
		.pipe(csv())
		.on('data', (data) => results.push(data))
		.on('end', async () => {
			const schema = parseLucidChart();
			await generatePrismaSchema(schema);
			format();
		});
};
