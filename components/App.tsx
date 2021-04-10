import { Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import FileUpload from '../components/FileUpload';

const useStyles = makeStyles((theme) => ({
	root: {
		height: '100vh',
		display: 'grid',
		gridTemplateRows: '.25fr 1fr',
		padding: theme.spacing(3),
	},
	upload: {
		height: '100%',
		display: 'grid',
		gridTemplateRows: 'auto 1fr',
		padding: theme.spacing(3),
	},
}));

export default function App() {
	const classes = useStyles();
	return (
		<Grid
			container
			spacing={3}
			className={classes.root}
			justify="center"
			direction="row"
		>
			<Grid container item xs={12} alignItems="center">
				<Typography>
					Upload a Lucidchart "CSV of Shape Data" CSV file
				</Typography>
			</Grid>
			<Grid container item xs={12} alignItems="center">
				<FileUpload />
			</Grid>
		</Grid>
	);
}
