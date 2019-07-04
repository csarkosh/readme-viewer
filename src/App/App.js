import React from 'react';
import { AppBar, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    appBar: {
        height: 40,
    },
    appBarLogo: {
        margin: 'auto 32px'
    },
    bodyText: {
        textAlign: 'center',
        marginTop: 48,
    }
});

const App = ({ classes }) => (
    <div>
        <AppBar className={classes.appBar} position="static">
            <Typography className={classes.appBarLogo} variant="h6">csarko.sh</Typography>
        </AppBar>
        <Typography className={classes.bodyText} variant="h1">Coming Soon</Typography>
    </div>
)

export default withStyles(styles)(App);
