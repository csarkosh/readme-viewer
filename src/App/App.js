import React from 'react';
import {AppBar, Grid, IconButton, Typography} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { FaGithub } from 'react-icons/fa'

const styles = theme => ({
    appBar: {
        height: 40,
    },
    appBarLogo: {
        margin: '8px 0 0 8px'
    },
    appBarGridContainer: {
        height: '100%',
    },
    bodyText: {
        marginTop: 48,
        textAlign: 'center',
        wordBreak: 'break-word'
    },
});

const App = ({ classes }) => (
    <div>
        <AppBar className={classes.appBar} position="sticky">
            <Grid className={classes.appBarGridContainer} container justify="space-between" alignContent="center">
                <Grid item>
                    <Typography className={classes.appBarLogo} variant="h6">csarko.sh</Typography>
                </Grid>
                <Grid item>
                    <IconButton color="inherit" aria-label="GitHub" href="https://github.com/csarkosh">
                        <FaGithub />
                    </IconButton>
                </Grid>
            </Grid>
        </AppBar>
        <Typography className={classes.bodyText} variant="h1">Coming Soon</Typography>
    </div>
)

export default withStyles(styles)(App);
