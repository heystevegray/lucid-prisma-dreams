import React from 'react';
import App from '../components/App';
import { createMuiTheme, makeStyles, Paper, ThemeProvider } from '@material-ui/core';

const theme = createMuiTheme({
	palette: {
		type: 'dark',
		primary: {
			main: '#48a1f0',
		},
	},
});

const useStyles = makeStyles(() => ({
	root: {
		height: '100vh',
		flexGrow: 1
	},
}));

export default function Index() {
	const classes = useStyles()
	return (
		<ThemeProvider theme={theme}>
			<Paper square className={classes.root}>
				<App />
			</Paper>
		</ThemeProvider >
	);
}
