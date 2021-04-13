import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Dropzone, { DropEvent, FileRejection } from 'react-dropzone';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import ProgressBar from './ProgressBar'

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: 300,
		border: `2px dashed ${theme.palette.primary.main}`,
		padding: theme.spacing(3),
	},
}));

function downloadFile(data, name = 'schema.prisma') {
	const type = 'csv';
	let blob = new Blob([data], { type });
	let url = window.URL.createObjectURL(blob);

	var link = document.createElement('a');
	// If you don't know the name or want to use
	// the webserver default set name = ''
	link.setAttribute('download', name);
	link.href = url;
	document.body.appendChild(link);
	link.click();
	link.remove();
}

export default function FileUpload() {
	const classes = useStyles();
	const [progress, setProgress] = useState(0)

	useEffect(() => {
		setProgress(0)
	}, [])

	const onDrop = async (
		acceptedFiles: any[],
		fileRejections: FileRejection[],
		event: DropEvent
	): Promise<void> => {
		console.log(acceptedFiles);

		if (!acceptedFiles?.length) {
			return;
		}

		// Reset progress bar
		setProgress(0)

		try {
			const config = {
				headers: { 'content-type': 'multipart/form-data' },
				onUploadProgress: (event) => {
					setProgress(Math.round((event.loaded * 100) / event.total))
				},
			};

			const formData = new FormData();

			formData.append('uploaded_file', acceptedFiles[0]);

			const response = await axios.post('/api/upload', formData, config);
			downloadFile(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Grid container justify="center" alignItems="center" direction="column">
			<Grid item>
				<ProgressBar value={progress} />
			</Grid>
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
