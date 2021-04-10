import { Grid } from '@material-ui/core';
import React from 'react';
import Dropzone, { DropEvent, FileRejection } from 'react-dropzone';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: 300,
		border: `2px dashed ${theme.palette.primary.main}`,
		padding: theme.spacing(3),
	},
}));

const onDrop = async (
	acceptedFiles: any[],
	fileRejections: FileRejection[],
	event: DropEvent
): Promise<void> => {
	console.log(acceptedFiles);

	if (!acceptedFiles?.length) {
		return;
	}

	try {
		const config = {
			headers: { 'content-type': 'multipart/form-data' },
			onUploadProgress: (event) => {
				console.log(
					`Current progress:`,
					Math.round((event.loaded * 100) / event.total)
				);
			},
		};

		const formData = new FormData();

		formData.append('uploaded_file', acceptedFiles[0]);

		const response = await axios.post('/api/upload', formData, config);

		console.log('response', response.data);
	} catch (error) {
		console.log(error);
	}
};

export default function FileUpload() {
	const classes = useStyles();
	return (
		<Grid container justify="center" alignItems="center">
			<Grid item className={classes.root}>
				<Dropzone onDrop={onDrop} accept=".csv" maxFiles={2}>
					{({ getRootProps, getInputProps }) => (
						<section>
							<div {...getRootProps()}>
								<input {...getInputProps()} />
								<p>Drag 'n' drop your file here, or click to select files</p>
							</div>
						</section>
					)}
				</Dropzone>
			</Grid>
		</Grid>
	);
}
