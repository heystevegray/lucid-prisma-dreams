import React from 'react'
import App from '../components/App'
import { createMuiTheme, Paper, ThemeProvider } from "@material-ui/core";

const theme = createMuiTheme({
	palette: {
		type: 'dark',
		primary: {
			main: "#48a1f0"
		}
	},

});

export default function Index() {
	return (
		<ThemeProvider theme={theme}>
			<Paper square>
				<App />
			</Paper>
		</ThemeProvider>
	)
}
