import mc from 'next-connect';
import multer from 'multer';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import {
	csvFile,
	lucidToPrisma,
	destinationFolder,
	schemaFile,
} from '../../utils';

const upload = multer({
	storage: multer.diskStorage({
		destination: destinationFolder,
		filename: (req, file, cb) => cb(null, csvFile),
	}),
});

const apiRoute = mc<NextApiRequest, NextApiResponse>({
	onError(error, req, res) {
		res.status(501).json({
			error: `Error! ${error.message}`,
		});
	},
	onNoMatch(req, res) {
		res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
	},
});

const uploadMiddleware = upload.single('uploaded_file');

// Adds the middleware to Next-Connect
apiRoute.use(uploadMiddleware);

apiRoute.post(async (req, res) => {
	await lucidToPrisma();
	var filePath = `${destinationFolder}/${schemaFile}`;

	var stat = fs.statSync(filePath);

	res.writeHead(200, {
		'Content-Type': 'csv',
		'Content-Length': stat.size,
	});

	var readStream = fs.createReadStream(filePath);
	// We replaced all the event handlers with a simple call to readStream.pipe()
	readStream.pipe(res);
});

export default apiRoute;

export const config = {
	api: {
		bodyParser: false, // Disallow body parsing, consume as stream
	},
};
