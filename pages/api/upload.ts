import mc from 'next-connect';
import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';
import { inputFile, lucidToPrisma, destinationFolder } from '../../utils';

const upload = multer({
	storage: multer.diskStorage({
		destination: destinationFolder,
		filename: (req, file, cb) => cb(null, inputFile),
	}),
});

const apiRoute = mc<NextApiRequest, NextApiResponse>({
	onError(error, req, res) {
		res
			.status(501)
			.json({ error: `Sorry something Happened! ${error.message}` });
	},
	onNoMatch(req, res) {
		res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
	},
});

const uploadMiddleware = upload.single('uploaded_file');

// Adds the middleware to Next-Connect
apiRoute.use(uploadMiddleware);

apiRoute.post(async (req, res) => {
	console.log('Sup from the api');
	await lucidToPrisma()
	res.status(200).json({ data: 'success' });
});

export default apiRoute;

export const config = {
	api: {
		bodyParser: false, // Disallow body parsing, consume as stream
	},
};
